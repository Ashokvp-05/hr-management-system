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
const db_1 = __importDefault(require("../config/db"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const password = 'password123';
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        // --------------------------------------------------------
        // 1. SETUP ROLES
        // --------------------------------------------------------
        // Admin Role
        let adminRole = yield db_1.default.role.findUnique({ where: { name: 'ADMIN' } });
        if (!adminRole) {
            console.log('Creating ADMIN role...');
            adminRole = yield db_1.default.role.create({
                data: { name: 'ADMIN', permissions: { all: true } }
            });
        }
        // Employee Role
        let employeeRole = yield db_1.default.role.findUnique({ where: { name: 'EMPLOYEE' } });
        if (!employeeRole) {
            console.log('Creating EMPLOYEE role...');
            employeeRole = yield db_1.default.role.create({
                data: { name: 'EMPLOYEE', permissions: { view_self: true, apply_leave: true } }
            });
        }
        // --------------------------------------------------------
        // 2. CREATE USERS
        // --------------------------------------------------------
        // --- ADMIN USER ---
        const adminEmail = 'admin@rudratic.com';
        const adminPass = 'admin123';
        const hashedAdminPass = yield bcryptjs_1.default.hash(adminPass, 10);
        yield db_1.default.user.upsert({
            where: { email: adminEmail },
            update: {
                password: hashedAdminPass,
                status: 'ACTIVE',
                role: { connect: { id: adminRole.id } }
            },
            create: {
                email: adminEmail,
                name: 'System Admin',
                password: hashedAdminPass,
                status: 'ACTIVE',
                role: { connect: { id: adminRole.id } }
            }
        });
        console.log(`✅ Admin Created: ${adminEmail} / ${adminPass}`);
        // --- EMPLOYEE USER ---
        const userEmail = 'employee@rudratic.com';
        const userPass = 'user123';
        const hashedUserPass = yield bcryptjs_1.default.hash(userPass, 10);
        yield db_1.default.user.upsert({
            where: { email: userEmail },
            update: {
                password: hashedUserPass,
                status: 'ACTIVE',
                role: { connect: { id: employeeRole.id } }
            },
            create: {
                email: userEmail,
                name: 'John Employee',
                password: hashedUserPass,
                status: 'ACTIVE',
                role: { connect: { id: employeeRole.id } }
            }
        });
        console.log(`✅ Employee Created: ${userEmail} / ${userPass}`);
    });
}
main()
    .catch(console.error)
    .finally(() => db_1.default.$disconnect());
