import prisma from '../config/db';
import { TimeEntryStatus, ClockType } from '@prisma/client';

export const getActiveEntry = async (userId: string) => {
    return prisma.timeEntry.findFirst({
        where: {
            userId,
            status: TimeEntryStatus.ACTIVE
        }
    });
};

export const clockIn = async (userId: string, type: ClockType, location?: any, isOnCall: boolean = false) => {
    // Check if already clocked in
    const active = await getActiveEntry(userId);
    if (active) {
        throw new Error('User is already clocked in');
    }

    return prisma.timeEntry.create({
        data: {
            userId,
            clockIn: new Date(),
            clockType: type,
            location: location || {},
            status: TimeEntryStatus.ACTIVE,
            isOnCall
        }
    });
};

export const clockOut = async (userId: string) => {
    const active = await getActiveEntry(userId);
    if (!active) {
        throw new Error('No active time entry found');
    }

    const now = new Date();
    const diffInMs = now.getTime() - active.clockIn.getTime();
    const hoursWorked = diffInMs / (1000 * 60 * 60);

    // Check for overtime (e.g. > 12 hours) - logic triggers here or just records it?
    // Master plan says: "If > 12 hours -> Show confirmation modal". This is a frontend check mostly, 
    // but backend should flag it or frontend sends a specific "confirm" flag.
    // For basic clockOut, we just save. If user wants to confirm overtime, that might be a separate flow or flag.
    // Let's assume standard clockout for now.

    return prisma.timeEntry.update({
        where: { id: active.id },
        data: {
            clockOut: now,
            hoursWorked: hoursWorked, // Prisma Decimal
            status: TimeEntryStatus.COMPLETED
        }
    });
};

export const getHistory = async (userId: string, limit = 10, skip = 0) => {
    return prisma.timeEntry.findMany({
        where: { userId },
        orderBy: { clockIn: 'desc' },
        take: limit,
        skip: skip
    });
};

export const getSummary = async (userId: string) => {
    // Basic Weekly Summary (last 7 days)
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - 7));

    const entries = await prisma.timeEntry.findMany({
        where: {
            userId,
            clockIn: {
                gte: startOfWeek
            },
            status: { in: [TimeEntryStatus.COMPLETED, TimeEntryStatus.ACTIVE] }
        }
    });

    let totalHours = 0;
    let daysWorked = new Set();
    let overtimeHours = 0; // Simple threshold > 9 hours per day

    entries.forEach(entry => {
        const duration = entry.hoursWorked ? Number(entry.hoursWorked) : 0;
        totalHours += duration;

        const dayKey = entry.clockIn.toISOString().split('T')[0];
        daysWorked.add(dayKey);

        if (duration > 9) {
            overtimeHours += (duration - 9);
        }
    });

    return {
        totalHours: totalHours.toFixed(2),
        overtimeHours: overtimeHours.toFixed(2),
        daysWorked: daysWorked.size
    };
};

export const getReport = async (startDate: Date, endDate: Date, userId?: string) => {
    return prisma.timeEntry.findMany({
        where: {
            userId: userId ? userId : undefined,
            clockIn: {
                gte: startDate,
                lte: endDate
            },
            status: { in: [TimeEntryStatus.COMPLETED, TimeEntryStatus.ACTIVE] }
        },
        include: {
            user: {
                select: { name: true, email: true, department: true }
            }
        },
        orderBy: { clockIn: 'desc' }
    });
};

export const getAllActiveUsers = async () => {
    return prisma.timeEntry.findMany({
        where: {
            status: TimeEntryStatus.ACTIVE
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    avatarUrl: true
                }
            }
        },
        orderBy: {
            clockIn: 'desc'
        }
    });
};
