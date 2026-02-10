"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCronJobs = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const db_1 = __importDefault(require("../config/db"));
const client_1 = require("@prisma/client");
const emailService = __importStar(require("./email.service"));
const notificationService = __importStar(require("./notification.service"));
const initCronJobs = () => {
    console.log('Initializing Cron Jobs...');
    // Rule: 7 PM Clock-Out Reminder
    // Runs every day at 19:00 (7 PM)
    node_cron_1.default.schedule('0 19 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('[CRON] Running 7 PM Clock-Out Check...');
        try {
            // Find all active entries
            const activeEntries = yield db_1.default.timeEntry.findMany({
                where: { status: client_1.TimeEntryStatus.ACTIVE },
                include: { user: true }
            });
            console.log(`[CRON] Found ${activeEntries.length} active sessions.`);
            for (const entry of activeEntries) {
                // Send Email
                if (entry.user.email) {
                    yield emailService.sendClockOutReminder(entry.user.email, entry.user.name || 'Employee');
                }
                // Send In-App Notification
                yield notificationService.createNotification({
                    userId: entry.userId,
                    title: 'Clock Out Reminder',
                    message: 'It is 7:00 PM. Please remember to clock out if you have finished for the day.',
                    type: client_1.NotificationType.INFO,
                    actionData: { action: 'clock-out' }
                });
            }
        }
        catch (error) {
            console.error('[CRON] Error in 7 PM Check:', error);
        }
    }));
    // Rule: Weekly Admin Summary Report
    // Runs every Monday at 8:00 AM
    node_cron_1.default.schedule('0 8 * * 1', () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('[CRON] Generating Weekly Admin Report...');
        try {
            const [totalUsers, totalHours, pendingLeaves, admins] = yield Promise.all([
                db_1.default.user.count({ where: { status: 'ACTIVE' } }),
                db_1.default.timeEntry.aggregate({ _sum: { hoursWorked: true } }),
                db_1.default.leaveRequest.count({ where: { status: 'PENDING' } }),
                db_1.default.user.findMany({
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
                    yield emailService.sendWeeklyReport(admin.email, stats);
                }
            }
        }
        catch (error) {
            console.error('[CRON] Error in Weekly Report:', error);
        }
    }));
};
exports.initCronJobs = initCronJobs;
