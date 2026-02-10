import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkBalances() {
    try {
        console.log('Checking all Leave Balances...');
        const balances = await prisma.leaveBalance.findMany({
            include: { user: { select: { name: true, email: true } } }
        });

        if (balances.length === 0) {
            console.log('No leave balances found in the database.');
        } else {
            console.table(balances.map(b => ({
                User: b.user.name,
                Email: b.user.email,
                Year: b.year,
                Sick: b.sick,
                Casual: b.casual,
                Earned: b.earned
            })));
        }

        // Check if there are users WITHOUT balances for 2026
        const users = await prisma.user.findMany();
        const currentYear = new Date().getFullYear();
        for (const user of users) {
            const hasBalance = balances.some(b => b.userId === user.id && b.year === currentYear);
            if (!hasBalance) {
                console.log(`User ${user.name} (${user.email}) is missing balance for ${currentYear}`);
            }
        }

    } catch (error) {
        console.error('Error checking balances:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkBalances();
