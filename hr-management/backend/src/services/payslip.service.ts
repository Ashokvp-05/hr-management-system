import prisma from '../config/db';
import path from 'path';
import fs from 'fs';
import { PayslipStatus } from '@prisma/client';

const UPLOAD_ROOT = path.join(process.cwd(), 'uploads/payslips');

// Ensure base directory exists
if (!fs.existsSync(UPLOAD_ROOT)) {
    fs.mkdirSync(UPLOAD_ROOT, { recursive: true });
}

export const uploadPayslip = async (
    userId: string,
    month: string,
    year: number,
    amount: number,
    fileBuffer: Buffer,
    filename: string
) => {
    // Generate secure path: uploads/payslips/YYYY/MONTH/userId_timestamp.pdf
    const safeFilename = `${userId}_${Date.now()}.pdf`;
    const yearDir = path.join(UPLOAD_ROOT, year.toString());
    const monthDir = path.join(yearDir, month);

    if (!fs.existsSync(monthDir)) {
        fs.mkdirSync(monthDir, { recursive: true });
    }

    const filePath = path.join(monthDir, safeFilename);
    const relativePath = path.relative(process.cwd(), filePath); // Store relative path for portability

    // Write file securely
    fs.writeFileSync(filePath, fileBuffer);

    // Create DB entry
    // Check if exists first to update or create
    const existing = await prisma.payslip.findFirst({
        where: { userId, month, year }
    });

    if (existing) {
        // Update existing record
        // Delete old file if needed (optional hygiene)
        try {
            const oldPath = path.join(process.cwd(), existing.fileUrl);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        } catch (e) { console.warn("Failed to delete old file", e); }

        return prisma.payslip.update({
            where: { id: existing.id },
            data: {
                fileUrl: relativePath,
                amount,
                status: 'GENERATED',
                updatedAt: new Date()
            }
        });
    }

    return prisma.payslip.create({
        data: {
            userId,
            month,
            year,
            amount,
            fileUrl: relativePath,
            status: 'GENERATED'
        }
    });
};

export const getPayslipFile = async (payslipId: string, requesterId: string, roleName: string) => {
    const payslip = await prisma.payslip.findUnique({
        where: { id: payslipId },
        include: { user: true }
    });

    if (!payslip) throw new Error("Payslip not found");

    // RBAC: Verify ownership or admin privileges
    if (roleName !== 'ADMIN' && roleName !== 'MANAGER' && payslip.userId !== requesterId) {
        throw new Error("Unauthorized access to this payslip");
    }

    const absolutePath = path.resolve(process.cwd(), payslip.fileUrl);

    if (!fs.existsSync(absolutePath)) {
        throw new Error("Payslip file not found on server");
    }

    return {
        path: absolutePath,
        filename: `${payslip.month}_${payslip.year}_Payslip.pdf`
    };
};

export const getMyPayslips = async (userId: string) => {
    return prisma.payslip.findMany({
        where: { userId },
        orderBy: [
            { year: 'desc' },
            { month: 'desc' }
        ]
    });
};

export const getAllPayslips = async (year?: number, month?: string) => {
    const whereClause: any = {};
    if (year) whereClause.year = year;
    if (month) whereClause.month = month;

    return prisma.payslip.findMany({
        where: whereClause,
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    department: true,
                    designation: true
                }
            }
        },
        orderBy: [
            { year: 'desc' },
            { month: 'desc' }
        ]
    });
};
