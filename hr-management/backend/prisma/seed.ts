import { PrismaClient, UserStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const employeePassword = await bcrypt.hash('employee123', 10);

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
        where: { email: 'admin@hrsystem.com' },
        update: {
            password: hashedPassword, // Ensure password is set if user exists
            roleId: adminRole.id
        },
        create: {
            email: 'admin@hrsystem.com',
            name: 'System Admin',
            password: hashedPassword,
            roleId: adminRole.id,
            status: UserStatus.ACTIVE,
            department: 'IT',
            designation: 'Administrator'
        },
    });

    const employee = await prisma.user.upsert({
        where: { email: 'employee@hrsystem.com' },
        update: {
            password: employeePassword, // Ensure password is set if user exists
            roleId: employeeRole.id
        },
        create: {
            email: 'employee@hrsystem.com',
            name: 'John Doe',
            password: employeePassword,
            roleId: employeeRole.id,
            status: UserStatus.ACTIVE,
            department: 'Engineering',
            designation: 'Software Engineer'
        },
    });

    console.log({ admin, employee });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
