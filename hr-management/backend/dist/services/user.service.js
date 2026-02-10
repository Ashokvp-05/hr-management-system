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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAvatar = exports.updateProfile = exports.getUserById = exports.updateUser = exports.getAllUsers = void 0;
const db_1 = __importDefault(require("../config/db"));
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return db_1.default.user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
            roleId: true,
            role: {
                select: { name: true }
            },
            department: true,
            designation: true,
            joiningDate: true,
            status: true,
            createdAt: true
        },
        orderBy: { createdAt: 'desc' }
    });
});
exports.getAllUsers = getAllUsers;
const updateUser = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    // If updating role, we need to map roleName to roleId potentially, 
    // but typically UI sends roleId. Let's assume for now keeping it simple.
    // If the Admin sends a roleId, we update it.
    return db_1.default.user.update({
        where: { id: userId },
        data: data
    });
});
exports.updateUser = updateUser;
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.default.user.findUnique({
        where: { id },
        include: { role: true }
    });
    if (!user)
        throw new Error('User not found');
    const _a = user, { password, resetToken, resetTokenExpiry } = _a, safeUser = __rest(_a, ["password", "resetToken", "resetTokenExpiry"]);
    return safeUser;
});
exports.getUserById = getUserById;
const updateProfile = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    // Basic validation
    return db_1.default.user.update({
        where: { id },
        data: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            discordId: data.discordId,
            department: data.department,
            designation: data.designation,
            timezone: data.timezone
        }
    });
});
exports.updateProfile = updateProfile;
const updateAvatar = (id, avatarUrl) => __awaiter(void 0, void 0, void 0, function* () {
    return db_1.default.user.update({
        where: { id },
        data: { avatarUrl }
    });
});
exports.updateAvatar = updateAvatar;
