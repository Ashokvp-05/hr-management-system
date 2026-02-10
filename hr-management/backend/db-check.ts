import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkConnection() {
    try {
        console.log('Testing database connection...');
        const userCount = await prisma.user.count();
        console.log(`Connection successful! Total users in database: ${userCount}`);

        const roles = await prisma.role.findMany();
        console.log('Roles found:', roles.map(r => r.name).join(', '));

        const systemStats = {
            users: userCount,
            leaves: await prisma.leaveRequest.count(),
            entries: await prisma.timeEntry.count(),
        };
        console.log('System Status Overview:', systemStats);

    } catch (error) {
        console.error('Database connection failed!');
        console.error(error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

checkConnection();
