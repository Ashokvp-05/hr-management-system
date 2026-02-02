"use strict";
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
exports.getReport = exports.getSummary = exports.getHistory = exports.clockOut = exports.clockIn = exports.getActiveEntry = void 0;
const db_1 = __importDefault(require("../config/db"));
const client_1 = require("@prisma/client");
const getActiveEntry = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return db_1.default.timeEntry.findFirst({
        where: {
            userId,
            status: client_1.TimeEntryStatus.ACTIVE
        }
    });
});
exports.getActiveEntry = getActiveEntry;
const clockIn = (userId_1, type_1, location_1, ...args_1) => __awaiter(void 0, [userId_1, type_1, location_1, ...args_1], void 0, function* (userId, type, location, isOnCall = false) {
    // Check if already clocked in
    const active = yield (0, exports.getActiveEntry)(userId);
    if (active) {
        throw new Error('User is already clocked in');
    }
    return db_1.default.timeEntry.create({
        data: {
            userId,
            clockIn: new Date(),
            clockType: type,
            location: location || {},
            status: client_1.TimeEntryStatus.ACTIVE,
            isOnCall
        }
    });
});
exports.clockIn = clockIn;
const clockOut = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const active = yield (0, exports.getActiveEntry)(userId);
    if (!active) {
        throw new Error('No active time entry found');
    }
    const now = new Date();
    const diffInMs = now.getTime() - active.clockIn.getTime();
    const hoursWorked = diffInMs / (1000 * 60 * 60);
    // Check for overtime (e.g. > 12 hours) - logic triggers here or just records it?
    // Master plan says: "If > 12 hours -> Show confirmation modal". This is a frontend check mostly, 
    // but backend should flag it or frontend sends a specific "confirm" flag.
    // For basic clockOut, we just save. If user wants to confirm overtime, that might be a separate flow or flag.
    // Let's assume standard clockout for now.
    return db_1.default.timeEntry.update({
        where: { id: active.id },
        data: {
            clockOut: now,
            hoursWorked: hoursWorked, // Prisma Decimal
            status: client_1.TimeEntryStatus.COMPLETED
        }
    });
});
exports.clockOut = clockOut;
const getHistory = (userId_1, ...args_1) => __awaiter(void 0, [userId_1, ...args_1], void 0, function* (userId, limit = 10, skip = 0) {
    return db_1.default.timeEntry.findMany({
        where: { userId },
        orderBy: { clockIn: 'desc' },
        take: limit,
        skip: skip
    });
});
exports.getHistory = getHistory;
const getSummary = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Basic Weekly Summary (last 7 days)
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - 7));
    const entries = yield db_1.default.timeEntry.findMany({
        where: {
            userId,
            clockIn: {
                gte: startOfWeek
            },
            status: { in: [client_1.TimeEntryStatus.COMPLETED, client_1.TimeEntryStatus.ACTIVE] }
        }
    });
    let totalHours = 0;
    let daysWorked = new Set();
    let overtimeHours = 0; // Simple threshold > 9 hours per day
    entries.forEach(entry => {
        const duration = entry.hoursWorked ? Number(entry.hoursWorked) : 0;
        totalHours += duration;
        const dayKey = entry.clockIn.toISOString().split('T')[0];
        daysWorked.add(dayKey);
        if (duration > 9) {
            overtimeHours += (duration - 9);
        }
    });
    return {
        totalHours: totalHours.toFixed(2),
        overtimeHours: overtimeHours.toFixed(2),
        daysWorked: daysWorked.size
    };
});
exports.getSummary = getSummary;
const getReport = (startDate, endDate) => __awaiter(void 0, void 0, void 0, function* () {
    return db_1.default.timeEntry.findMany({
        where: {
            clockIn: {
                gte: startDate,
                lte: endDate
            },
            status: client_1.TimeEntryStatus.COMPLETED
        },
        include: {
            user: {
                select: { name: true, email: true, department: true }
            }
        },
        orderBy: { clockIn: 'desc' }
    });
});
exports.getReport = getReport;
