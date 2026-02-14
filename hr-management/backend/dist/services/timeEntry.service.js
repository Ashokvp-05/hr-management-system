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
exports.getAllActiveUsers = exports.getReport = exports.getSummary = exports.getHistory = exports.clockOut = exports.clockIn = exports.getActiveEntry = void 0;
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
        const duration = Math.floor((new Date().getTime() - active.clockIn.getTime()) / (1000 * 60));
        throw new Error(`Already clocked in ${duration} minutes ago. Please clock out first.`);
    }
    // Validate clock type
    if (!Object.values(client_1.ClockType).includes(type)) {
        throw new Error('Invalid clock type. Must be IN_OFFICE, REMOTE, or HYBRID');
    }
    return db_1.default.timeEntry.create({
        data: {
            userId,
            clockIn: new Date(),
            clockType: type,
            location: location || {},
            status: client_1.TimeEntryStatus.ACTIVE,
            isOnCall
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true
                }
            }
        }
    });
});
exports.clockIn = clockIn;
const clockOut = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const active = yield (0, exports.getActiveEntry)(userId);
    if (!active) {
        throw new Error('No active clock-in session found. Please clock in first.');
    }
    const now = new Date();
    const diffInMs = now.getTime() - active.clockIn.getTime();
    const hoursWorked = diffInMs / (1000 * 60 * 60);
    // Validate minimum time (prevent accidental clock-outs but allow corrections)
    if (hoursWorked < 0.0083) { // Less than 30 seconds
        throw new Error('Please wait at least 30 seconds before clocking out');
    }
    // Check for excessive hours (>24 hours - likely an error but possible)
    if (hoursWorked > 24) {
        throw new Error(`Unusual work duration detected: ${hoursWorked.toFixed(2)} hours. Please contact admin.`);
    }
    return db_1.default.timeEntry.update({
        where: { id: active.id },
        data: {
            clockOut: now,
            hoursWorked: Number(hoursWorked.toFixed(2)),
            status: client_1.TimeEntryStatus.COMPLETED
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true
                }
            }
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
const getReport = (startDate, endDate, userId, departmentId) => __awaiter(void 0, void 0, void 0, function* () {
    return db_1.default.timeEntry.findMany({
        where: {
            userId: userId ? userId : undefined,
            user: departmentId ? { department: departmentId } : undefined,
            clockIn: {
                gte: startDate,
                lte: endDate
            },
            status: { in: [client_1.TimeEntryStatus.COMPLETED, client_1.TimeEntryStatus.ACTIVE] }
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
const getAllActiveUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return db_1.default.timeEntry.findMany({
        where: {
            status: client_1.TimeEntryStatus.ACTIVE
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    avatarUrl: true
                }
            }
        },
        orderBy: {
            clockIn: 'desc'
        }
    });
});
exports.getAllActiveUsers = getAllActiveUsers;
