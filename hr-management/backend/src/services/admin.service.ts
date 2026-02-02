import prisma from '../config/db';
import { UserStatus } from '@prisma/client';

export const getPendingUsers = async () => {
    return prisma.user.findMany({
        where: { status: UserStatus.PENDING },
        select: { id: true, email: true, name: true, createdAt: true },
    });
};

export const approveUser = async (userId: string) => {
    return prisma.user.update({
        where: { id: userId },
        data: { status: UserStatus.ACTIVE },
    });
};

export const rejectUser = async (userId: string) => {
    return prisma.user.update({
        where: { id: userId },
        data: { status: UserStatus.SUSPENDED }, // Or delete
    });
};

export const getDatabaseStats = async () => {
    const [users, timeEntries, leaves, holidays, notifications, roles] = await Promise.all([
        prisma.user.count(),
        prisma.timeEntry.count(),
        prisma.leaveRequest.count(),
        prisma.holiday.count(),
        prisma.notification.count(),
        prisma.role.count()
    ]);

    return [
        { table: 'Users', count: users, icon: 'users' },
        { table: 'Time Entries', count: timeEntries, icon: 'clock' },
        { table: 'Leaves', count: leaves, icon: 'calendar-off' },
        { table: 'Holidays', count: holidays, icon: 'palmtree' },
        { table: 'Notifications', count: notifications, icon: 'bell' },
        { table: 'Roles', count: roles, icon: 'shield' },
    ];
};

