import prisma from '../config/db';
import path from 'path';
import fs from 'fs';
import { PayslipStatus } from '@prisma/client';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { createNotification } from './notification.service';
import { logAction } from './audit.service';

const UPLOAD_ROOT = path.join(process.cwd(), 'uploads/payslips');

export const generatePayslipFromTemplate = async (
    userId: string,
    month: string,
    year: number,
    amount: number
) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, department: true, designation: true }
    });

    if (!user) throw new Error("User not found");

    const doc = new jsPDF();

    // --- DESIGN THE PREMIUM TEMPLATE ---
    // 1. Header & Identity
    doc.setFillColor(79, 70, 229); // Indigo-600
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("RUDRATIC HR", 15, 25);

    doc.setFontSize(10);
    doc.text("SECURE PAYROLL SYSTEM", 15, 32);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.text("PAY ADVICE", 15, 55);

    doc.setDrawColor(226, 232, 240);
    doc.line(15, 60, 195, 60);

    // 2. Employee Info Grid
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text("EMPLOYEE", 15, 70);
    doc.text("PAYMENT PERIOD", 110, 70);

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(user.name || "Unknown", 15, 76);
    doc.text(`${month.toUpperCase()} ${year} `, 110, 76);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(`System ID: ${user.id.slice(0, 8)} `, 15, 81);
    doc.text(`Dept: ${user.department || 'General'} `, 15, 86);

    // 3. Earnings Table
    autoTable(doc, {
        startY: 100,
        head: [['Description', 'Amount']],
        body: [
            ['Basic Salary', `$ ${amount.toLocaleString()} `],
            ['Allowances', '$ 0.00'],
            ['Bonuses', '$ 0.00'],
        ],
        headStyles: { fillColor: [248, 250, 252], textColor: [71, 85, 105], fontStyle: 'bold' },
        bodyStyles: { textColor: [15, 23, 42] },
        theme: 'striped'
    });

    // 4. Net Pay Highlight
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFillColor(248, 250, 252);
    doc.rect(110, finalY, 85, 25, 'F');

    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text("NET PAYABLE AMOUNT", 115, finalY + 10);

    doc.setFontSize(16);
    doc.setTextColor(79, 70, 229);
    doc.setFont("helvetica", "bold");
    doc.text(`$ ${amount.toLocaleString()} `, 115, finalY + 20);

    // 5. Footer & Authenticity
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text("This is a computer generated document and does not require a physical signature.", 15, 280);
    doc.text(`Generated on ${new Date().toLocaleString()} | RUDRATIC HR SECURITY`, 15, 285);

    // Save PDF to Buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    // Reuse upload logic to save file and create DB entry
    return uploadPayslip(
        userId,
        month,
        year,
        amount,
        pdfBuffer,
        `System_Generated_${month}_${year}.pdf`
    );
};

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

    // If owner downloads, update status to DOWNLOADED
    if (payslip.userId === requesterId && payslip.status === 'SENT') {
        await prisma.payslip.update({
            where: { id: payslipId },
            data: { status: 'DOWNLOADED' }
        });
    }

    return {
        path: absolutePath,
        filename: `${payslip.month}_${payslip.year} _Payslip.pdf`
    };
};

export const releasePayslip = async (id: string) => {
    const slip = await prisma.payslip.update({
        where: { id },
        data: { status: 'SENT' }
    });

    // Notify user
    try {
        await createNotification({
            userId: slip.userId,
            title: "New Payslip Released",
            message: `Your payslip for ${slip.month} ${slip.year} is now available for download.`,
            type: 'PAYROLL' as any
        });
    } catch (e) {
        console.error("Failed to notify user about payslip release", e);
    }

    return slip;
};

export const getMyPayslips = async (userId: string) => {
    return prisma.payslip.findMany({
        where: {
            userId,
            status: { in: ['SENT', 'DOWNLOADED'] }
        },
        orderBy: [
            { year: 'desc' },
            { month: 'desc' }
        ]
    });
};

export const getAllPayslips = async (year?: number, month?: string, status?: string) => {
    const whereClause: any = {};
    if (year) whereClause.year = year;
    if (month) whereClause.month = month;
    if (status) whereClause.status = status;

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

export const bulkReleasePayslips = async (ids: string[]) => {
    const results = await prisma.payslip.updateMany({
        where: { id: { in: ids }, status: 'GENERATED' },
        data: { status: 'SENT' }
    });

    // Create notifications for all updated payslips
    const updatedPayslips = await prisma.payslip.findMany({
        where: { id: { in: ids }, status: 'SENT' },
        select: { userId: true, month: true, year: true }
    });

    for (const slip of updatedPayslips) {
        try {
            await createNotification({
                userId: slip.userId,
                title: "New Payslip Released",
                message: `Your payslip for ${slip.month} ${slip.year} is now available for download.`,
                type: 'PAYROLL' as any
            });
        } catch (e) {
            console.error("Failed to notify user about payslip release", e);
        }
    }

    return results;
};

export const deletePayslip = async (id: string) => {
    return prisma.payslip.delete({
        where: { id }
    });
};

export const updatePayslip = async (id: string, data: { month?: string, year?: number, amount?: number, status?: PayslipStatus }) => {
    return prisma.payslip.update({
        where: { id },
        data
    });
};
