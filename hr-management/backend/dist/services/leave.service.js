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
exports.updateStatus = exports.getBalance = exports.getAllRequests = exports.getUserRequests = exports.createRequest = void 0;
const db_1 = __importDefault(require("../config/db"));
const client_1 = require("@prisma/client");
const createRequest = (data) => __awaiter(void 0, void 0, void 0, function* () {
    // Check for overlaps
    const overlapping = yield db_1.default.leaveRequest.findFirst({
        where: {
            userId: data.userId,
            status: { not: client_1.LeaveStatus.REJECTED },
            OR: [
                { startDate: { lte: data.endDate }, endDate: { gte: data.startDate } }
            ]
        }
    });
    if (overlapping)
        throw new Error('Leave request overlaps with an existing request');
    // Check Balance (Optimistic check, real deduction happens on approval)
    const balance = yield (0, exports.getBalance)(data.userId);
    const daysRequested = Math.ceil((data.endDate.getTime() - data.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    // Simple check based on type
    if (data.type === client_1.LeaveType.SICK && balance.sick < daysRequested)
        throw new Error(`Insufficient Sick Leave balance. Available: ${balance.sick}`);
    if (data.type === client_1.LeaveType.CASUAL && balance.casual < daysRequested)
        throw new Error(`Insufficient Casual Leave balance. Available: ${balance.casual}`);
    if (data.type === client_1.LeaveType.EARNED && balance.earned < daysRequested)
        throw new Error(`Insufficient Earned Leave balance. Available: ${balance.earned}`);
    return db_1.default.leaveRequest.create({
        data: {
            userId: data.userId,
            type: data.type,
            startDate: data.startDate,
            endDate: data.endDate,
            reason: data.reason
        }
    });
});
exports.createRequest = createRequest;
const getUserRequests = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return db_1.default.leaveRequest.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
    });
});
exports.getUserRequests = getUserRequests;
const getAllRequests = () => __awaiter(void 0, void 0, void 0, function* () {
    return db_1.default.leaveRequest.findMany({
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'desc' }
    });
});
exports.getAllRequests = getAllRequests;
const getBalance = (userId_1, ...args_1) => __awaiter(void 0, [userId_1, ...args_1], void 0, function* (userId, year = new Date().getFullYear()) {
    let balance = yield db_1.default.leaveBalance.findUnique({
        where: { userId_year: { userId, year } }
    });
    if (!balance) {
        // Initialize if not exists
        balance = yield db_1.default.leaveBalance.create({
            data: { userId, year } // Uses defaults from schema
        });
    }
    return balance;
});
exports.getBalance = getBalance;
const updateStatus = (requestId, status, adminId, reason) => __awaiter(void 0, void 0, void 0, function* () {
    return db_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const request = yield tx.leaveRequest.findUnique({ where: { id: requestId } });
        if (!request)
            throw new Error("Request not found");
        if (request.status !== client_1.LeaveStatus.PENDING)
            throw new Error("Request is not pending");
        // If Approving, Deduct Balance
        if (status === client_1.LeaveStatus.APPROVED) {
            const days = Math.ceil((request.endDate.getTime() - request.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
            const balance = yield tx.leaveBalance.findUnique({
                where: { userId_year: { userId: request.userId, year: new Date().getFullYear() } }
            });
            if (!balance)
                throw new Error("Balance record not found");
            const updateData = {};
            if (request.type === client_1.LeaveType.SICK) {
                if (balance.sick < days)
                    throw new Error("Insufficient Sick Leave balance during approval");
                updateData.sick = { decrement: days };
            }
            else if (request.type === client_1.LeaveType.CASUAL) {
                if (balance.casual < days)
                    throw new Error("Insufficient Casual Leave balance during approval");
                updateData.casual = { decrement: days };
            }
            else if (request.type === client_1.LeaveType.EARNED) {
                if (balance.earned < days)
                    throw new Error("Insufficient Earned Leave balance during approval");
                updateData.earned = { decrement: days };
            }
            if (Object.keys(updateData).length > 0) {
                yield tx.leaveBalance.update({
                    where: { id: balance.id },
                    data: updateData
                });
            }
        }
        return tx.leaveRequest.update({
            where: { id: requestId },
            data: { status, approvedBy: adminId, rejectionReason: reason }
        });
    }));
});
exports.updateStatus = updateStatus;
