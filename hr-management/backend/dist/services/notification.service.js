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
exports.markAllAsRead = exports.markAsRead = exports.getUserNotifications = exports.createNotification = void 0;
const db_1 = __importDefault(require("../config/db"));
const createNotification = (userId, title, message, type, actionData) => __awaiter(void 0, void 0, void 0, function* () {
    return db_1.default.notification.create({
        data: {
            userId,
            title,
            message,
            type,
            actionData: actionData || {}
        }
    });
});
exports.createNotification = createNotification;
const getUserNotifications = (userId_1, ...args_1) => __awaiter(void 0, [userId_1, ...args_1], void 0, function* (userId, limit = 20) {
    return db_1.default.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit
    });
});
exports.getUserNotifications = getUserNotifications;
const markAsRead = (notificationId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Ensure the notification belongs to the user
    const notification = yield db_1.default.notification.findFirst({
        where: { id: notificationId, userId }
    });
    if (!notification) {
        throw new Error('Notification not found or unauthorized');
    }
    return db_1.default.notification.update({
        where: { id: notificationId },
        data: { isRead: true }
    });
});
exports.markAsRead = markAsRead;
const markAllAsRead = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return db_1.default.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true }
    });
});
exports.markAllAsRead = markAllAsRead;
