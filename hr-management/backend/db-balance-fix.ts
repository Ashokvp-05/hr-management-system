import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixBalances() {
    try {
        console.log('Fixing Leave Balances for 2026...');
        const users = await prisma.user.findMany();
        const currentYear = new Date().getFullYear();

        for (const user of users) {
            const balance = await prisma.leaveBalance.findUnique({
                where: { userId_year: { userId: user.id, year: currentYear } }
            });

            if (!balance) {
                console.log(`Creating balance for ${user.name} for ${currentYear}`);
                await prisma.leaveBalance.create({
                    data: {
                        userId: user.id,
                        year: currentYear,
                        sick: 10,
                        casual: 10,
                        earned: 15
                    }
                });
            } else {
                console.log(`Balance already exists for ${user.name}`);
            }
        }
        console.log('All balances synchronized.');
    } catch (error) {
        console.error('Error fixing balances:', error);
    } finally {
        await prisma.$disconnect();
    }
}

fixBalances();
