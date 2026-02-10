import { PrismaClient, UserStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('Rudratic@Admin#2026', 10);
    const employeePassword = await bcrypt.hash('Rudratic@User#2026', 10);

    // Create Roles
    const adminRole = await prisma.role.upsert({
        where: { name: 'ADMIN' },
        update: {},
        create: {
            name: 'ADMIN',
            permissions: { all: true },
        },
    });

    const employeeRole = await prisma.role.upsert({
        where: { name: 'EMPLOYEE' },
        update: {},
        create: {
            name: 'EMPLOYEE',
            permissions: { read: true },
        },
    });

    // Create Users
    const admin = await prisma.user.upsert({
        where: { email: 'admin@rudratic.com' },
        update: {
            password: hashedPassword, // Ensure password is set if user exists
            roleId: adminRole.id
        },
        create: {
            email: 'admin@rudratic.com',
            name: 'System Admin',
            password: hashedPassword,
            roleId: adminRole.id,
            status: UserStatus.ACTIVE,
            department: 'IT',
            designation: 'Administrator'
        },
    });

    const employee = await prisma.user.upsert({
        where: { email: 'employee@rudratic.com' },
        update: {
            password: employeePassword, // Ensure password is set if user exists
            roleId: employeeRole.id
        },
        create: {
            email: 'employee@rudratic.com',
            name: 'John Doe',
            password: employeePassword,
            roleId: employeeRole.id,
            status: UserStatus.ACTIVE,
            department: 'Engineering',
            designation: 'Software Engineer'
        },
    });

    // Create Manager Role and User
    const managerPassword = await bcrypt.hash('Rudratic@Mgr#2026', 10);

    const managerRole = await prisma.role.upsert({
        where: { name: 'MANAGER' },
        update: {},
        create: {
            name: 'MANAGER',
            permissions: { read: true, write: false, manage_team: false },
        },
    });

    const manager = await prisma.user.upsert({
        where: { email: 'manager@rudratic.com' },
        update: {
            password: managerPassword,
            roleId: managerRole.id
        },
        create: {
            email: 'manager@rudratic.com',
            name: 'Sarah Manager',
            password: managerPassword,
            roleId: managerRole.id,
            status: UserStatus.ACTIVE,
            department: 'Sales',
            designation: 'Sales Director'
        },
    });

    console.log({ admin, employee, manager });

    // --- MOCK ATTENDANCE DATA (Last 7 Days) ---
    console.log('Seeding attendance data...');
    const now = new Date();
    for (let i = 0; i < 7; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);

        // 9 AM Start
        const clockIn = new Date(date);
        clockIn.setHours(9, 0, 0, 0);

        // 6 PM End (9 hours)
        const clockOut = new Date(date);
        clockOut.setHours(18, 0, 0, 0);

        await prisma.timeEntry.create({
            data: {
                userId: employee.id,
                clockIn,
                clockOut,
                hoursWorked: 9.0,
                clockType: i % 3 === 0 ? 'REMOTE' : 'IN_OFFICE',
                status: 'COMPLETED'
            }
        });

        // Admin also worked
        await prisma.timeEntry.create({
            data: {
                userId: admin.id,
                clockIn: new Date(clockIn.getTime() + 30 * 60000), // 9:30 AM
                clockOut: new Date(clockOut.getTime() - 60 * 60000), // 5:00 PM
                hoursWorked: 7.5,
                clockType: 'IN_OFFICE',
                status: 'COMPLETED'
            }
        });
    }

    // --- MOCK LEAVE DATA ---
    console.log('Seeding leave requests...');
    const leave1 = await prisma.leaveRequest.create({
        data: {
            userId: employee.id,
            type: 'SICK',
            startDate: new Date(now.getTime() + 86400000 * 2), // 2 days later
            endDate: new Date(now.getTime() + 86400000 * 3),
            reason: 'Feeling unwell',
            status: 'PENDING'
        }
    });

    await prisma.leaveRequest.create({
        data: {
            userId: manager.id,
            type: 'CASUAL',
            startDate: new Date(now.getTime() - 86400000 * 10),
            endDate: new Date(now.getTime() - 86400000 * 8),
            reason: 'Family event',
            status: 'APPROVED',
            approvedBy: admin.id
        }
    });

    // --- ACTIVE SESSION (For Dashboard Workload) ---
    console.log('Seeding active session...');
    await prisma.timeEntry.create({
        data: {
            userId: employee.id,
            clockIn: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
            clockType: 'REMOTE',
            status: 'ACTIVE',
            location: { city: 'San Francisco', lat: 37.7749, lng: -122.4194 }
        }
    });

    // --- AUDIT LOGS ---
    console.log('Seeding audit logs...');
    const AuditLog = (prisma as any).auditLog;
    if (AuditLog) {
        await AuditLog.createMany({
            data: [
                { action: 'LOGIN', adminId: admin.id, targetId: admin.id, details: 'Admin system login' },
                { action: 'USER_ROLE_UPDATE', adminId: admin.id, targetId: employee.id, details: 'Updated employee permissions' },
                { action: 'LEAVE_APPROVE', adminId: admin.id, targetId: manager.id, details: 'Approved casual leave for Sarah' },
                { action: 'SETTINGS_UPDATE', adminId: admin.id, targetId: admin.id, details: 'Updated system clock-out rules' }
            ]
        });
    }

    console.log('Mock activity data seeded successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
