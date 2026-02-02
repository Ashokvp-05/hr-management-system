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
exports.verifyCredentials = exports.requestRegistration = void 0;
const db_1 = __importDefault(require("../config/db"));
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    name: zod_1.z.string().min(2),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
const requestRegistration = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name } = registerSchema.parse(data);
    const existingUser = yield db_1.default.user.findUnique({
        where: { email },
    });
    if (existingUser) {
        throw new Error('User already exists');
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    const user = yield db_1.default.user.create({
        data: {
            email,
            name,
            password: hashedPassword,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    return { id: user.id, email: user.email, status: user.status };
});
exports.requestRegistration = requestRegistration;
const verifyCredentials = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email, password } = loginSchema.parse(data);
    const user = yield db_1.default.user.findUnique({
        where: { email },
        include: { role: true }
    });
    if (!user) {
        console.log('User not found:', email);
        throw new Error('Invalid credentials');
    }
    // Cast user to any to avoid TS errors with potentially stale Prisma types
    const userWithPassword = user;
    if (!userWithPassword.password) {
        throw new Error('Invalid credentials');
    }
    const isValid = yield bcryptjs_1.default.compare(password, userWithPassword.password);
    if (!isValid) {
        console.log('Password mismatch for user:', email);
        throw new Error('Invalid credentials');
    }
    if (user.status !== client_1.UserStatus.ACTIVE) {
        // In a real app we might allow login but restrict access, or deny login.
        // For now, let's allow it but the frontend should handle the PENDING state.
        // OR deny it:
        // throw new Error(`Account is ${user.status}`);
    }
    const token = jsonwebtoken_1.default.sign({
        id: user.id,
        email: user.email,
        roleId: user.roleId,
        status: user.status
    }, process.env.JWT_SECRET || 'super-secret-key', { expiresIn: '1d' });
    // Return user info sans password
    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            roleId: user.roleId,
            role: (_a = user.role) === null || _a === void 0 ? void 0 : _a.name,
            status: user.status
        }
    };
});
exports.verifyCredentials = verifyCredentials;
