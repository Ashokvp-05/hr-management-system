
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
    try {
        const managers = await prisma.user.findMany({
            where: { role: { name: 'MANAGER' } },
            include: { role: true }
        });
        // @ts-ignore
        console.log("Managers Found:", managers.map(m => ({ name: m.name, email: m.email, dept: m.department })));

        const users = await prisma.user.findMany({
            where: { department: { not: null } }
        });
        // @ts-ignore
        console.log("Users with Dept:", users.map(u => ({ name: u.name, dept: u.department })));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
check();
