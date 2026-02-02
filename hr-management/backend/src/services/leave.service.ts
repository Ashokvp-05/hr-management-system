import prisma from '../config/db';
import { LeaveType, LeaveStatus } from '@prisma/client';

interface CreateLeaveRequestDTO {
    userId: string;
    type: LeaveType;
    startDate: Date;
    endDate: Date;
    reason?: string;
}

export const createRequest = async (data: CreateLeaveRequestDTO) => {
    // Check for overlaps
    const overlapping = await prisma.leaveRequest.findFirst({
        where: {
            userId: data.userId,
            status: { not: LeaveStatus.REJECTED },
            OR: [
                { startDate: { lte: data.endDate }, endDate: { gte: data.startDate } }
            ]
        }
    });
    if (overlapping) throw new Error('Leave request overlaps with an existing request');

    // Check Balance (Optimistic check, real deduction happens on approval)
    const balance = await getBalance(data.userId);
    const daysRequested = Math.ceil((data.endDate.getTime() - data.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Simple check based on type
    if (data.type === LeaveType.SICK && balance.sick < daysRequested) throw new Error(`Insufficient Sick Leave balance. Available: ${balance.sick}`);
    if (data.type === LeaveType.CASUAL && balance.casual < daysRequested) throw new Error(`Insufficient Casual Leave balance. Available: ${balance.casual}`);
    if (data.type === LeaveType.EARNED && balance.earned < daysRequested) throw new Error(`Insufficient Earned Leave balance. Available: ${balance.earned}`);

    return prisma.leaveRequest.create({
        data: {
            userId: data.userId,
            type: data.type,
            startDate: data.startDate,
            endDate: data.endDate,
            reason: data.reason
        }
    });
};

export const getUserRequests = async (userId: string) => {
    return prisma.leaveRequest.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
    });
};

export const getAllRequests = async () => {
    return prisma.leaveRequest.findMany({
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'desc' }
    });
};

export const getBalance = async (userId: string, year = new Date().getFullYear()) => {
    let balance = await prisma.leaveBalance.findUnique({
        where: { userId_year: { userId, year } }
    });

    if (!balance) {
        // Initialize if not exists
        balance = await prisma.leaveBalance.create({
            data: { userId, year } // Uses defaults from schema
        });
    }
    return balance;
};

export const updateStatus = async (requestId: string, status: LeaveStatus, adminId: string, reason?: string) => {
    return prisma.$transaction(async (tx) => {
        const request = await tx.leaveRequest.findUnique({ where: { id: requestId } });
        if (!request) throw new Error("Request not found");
        if (request.status !== LeaveStatus.PENDING) throw new Error("Request is not pending");

        // If Approving, Deduct Balance
        if (status === LeaveStatus.APPROVED) {
            const days = Math.ceil((request.endDate.getTime() - request.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
            const balance = await tx.leaveBalance.findUnique({
                where: { userId_year: { userId: request.userId, year: new Date().getFullYear() } }
            });

            if (!balance) throw new Error("Balance record not found");

            const updateData: any = {};
            if (request.type === LeaveType.SICK) {
                if (balance.sick < days) throw new Error("Insufficient Sick Leave balance during approval");
                updateData.sick = { decrement: days };
            } else if (request.type === LeaveType.CASUAL) {
                if (balance.casual < days) throw new Error("Insufficient Casual Leave balance during approval");
                updateData.casual = { decrement: days };
            } else if (request.type === LeaveType.EARNED) {
                if (balance.earned < days) throw new Error("Insufficient Earned Leave balance during approval");
                updateData.earned = { decrement: days };
            }

            if (Object.keys(updateData).length > 0) {
                await tx.leaveBalance.update({
                    where: { id: balance.id },
                    data: updateData
                });
            }
        }

        return tx.leaveRequest.update({
            where: { id: requestId },
            data: { status, approvedBy: adminId, rejectionReason: reason }
        });
    });
};
