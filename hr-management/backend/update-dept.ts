
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function update() {
    try {
        const john = await prisma.user.findFirst({ where: { email: 'john@example.com' } }); // John Doe usually
        if (john) {
            await prisma.user.update({
                where: { id: john.id },
                data: { department: 'Sales' }
            });
            console.log("Updated John to Sales");
        } else {
            // Try check by name
            const johnByName = await prisma.user.findFirst({ where: { name: 'John Doe' } });
            if (johnByName) {
                await prisma.user.update({
                    where: { id: johnByName.id },
                    data: { department: 'Sales' }
                });
                console.log("Updated John (by name) to Sales");
            }
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
update();
