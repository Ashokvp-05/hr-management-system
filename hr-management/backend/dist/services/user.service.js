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
exports.updateUser = exports.getAllUsers = void 0;
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
