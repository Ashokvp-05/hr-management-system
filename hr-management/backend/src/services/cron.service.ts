import cron from 'node-cron';
import prisma from '../config/db';
import { TimeEntryStatus, NotificationType } from '@prisma/client';
import * as emailService from './email.service';
import * as notificationService from './notification.service';

export const initCronJobs = () => {
    console.log('Initializing Cron Jobs...');

    // Rule: 7 PM Clock-Out Reminder
    // Runs every day at 19:00 (7 PM)
    cron.schedule('0 19 * * *', async () => {
        console.log('[CRON] Running 7 PM Clock-Out Check...');

        try {
            // Find all active entries
            const activeEntries = await prisma.timeEntry.findMany({
                where: { status: TimeEntryStatus.ACTIVE },
                include: { user: true }
            });

            console.log(`[CRON] Found ${activeEntries.length} active sessions.`);

            for (const entry of activeEntries) {
                // Send Email
                if (entry.user.email) {
                    await emailService.sendClockOutReminder(entry.user.email, entry.user.name || 'Employee');
                }

                // Send In-App Notification
                await notificationService.createNotification(
                    entry.userId,
                    'Clock Out Reminder',
                    'It is 7:00 PM. Please remember to clock out if you have finished for the day.',
                    NotificationType.INFO, // Assuming INFO exists, or we update schema
                    { action: 'clock-out' }
                );
            }
        } catch (error) {
            console.error('[CRON] Error in 7 PM Check:', error);
        }
    });

    // Rule: Weekly Admin Summary Report
    // Runs every Monday at 8:00 AM
    cron.schedule('0 8 * * 1', async () => {
        console.log('[CRON] Generating Weekly Admin Report...');

        try {
            const [totalUsers, totalHours, pendingLeaves, admins] = await Promise.all([
                prisma.user.count({ where: { status: 'ACTIVE' } }),
                prisma.timeEntry.aggregate({ _sum: { hoursWorked: true } }),
                prisma.leaveRequest.count({ where: { status: 'PENDING' } }),
                prisma.user.findMany({
                    where: { role: { name: 'ADMIN' } },
                    select: { email: true }
                })
            ]);

            const stats = {
                totalUsers,
                totalHours: totalHours._sum.hoursWorked || 0,
                pendingLeaves
            };

            for (const admin of admins) {
                if (admin.email) {
                    await emailService.sendWeeklyReport(admin.email, stats);
                }
            }
        } catch (error) {
            console.error('[CRON] Error in Weekly Report:', error);
        }
    });
};

