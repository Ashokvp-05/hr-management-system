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
        console.log('--- Initializing Roles and Users ---');
        // 1. Create Roles
        const adminRole = yield db_1.default.role.upsert({
            where: { name: 'ADMIN' },
            update: {},
            create: {
                name: 'ADMIN',
                permissions: { all: true }
            }
        });
        const employeeRole = yield db_1.default.role.upsert({
            where: { name: 'EMPLOYEE' },
            update: {},
            create: {
                name: 'EMPLOYEE',
                permissions: { all: false, self: true }
            }
        });
        console.log('Roles created: ADMIN, EMPLOYEE');
        // 2. Create Admin User
        const adminPass = 'admin123';
        const hashedAdminPass = yield bcryptjs_1.default.hash(adminPass, 10);
        yield db_1.default.user.upsert({
            where: { email: 'admin@hrsystem.com' },
            update: {
                password: hashedAdminPass,
                roleId: adminRole.id,
                status: 'ACTIVE'
            },
            create: {
                email: 'admin@hrsystem.com',
                name: 'System Admin',
                password: hashedAdminPass,
                roleId: adminRole.id,
                status: 'ACTIVE'
            }
        });
        // 3. Create Employee User
        const employeePass = 'employee123';
        const hashedEmployeePass = yield bcryptjs_1.default.hash(employeePass, 10);
        yield db_1.default.user.upsert({
            where: { email: 'employee@hrsystem.com' },
            update: {
                password: hashedEmployeePass,
                roleId: employeeRole.id,
                status: 'ACTIVE'
            },
            create: {
                email: 'employee@hrsystem.com',
                name: 'John Employee',
                password: hashedEmployeePass,
                roleId: employeeRole.id,
                status: 'ACTIVE'
            }
        });
        console.log('\n--- Setup Complete ---');
        console.log('Admin: admin@hrsystem.com / admin123');
        console.log('Employee: employee@hrsystem.com / employee123');
    });
}
main()
    .catch(console.error)
    .finally(() => db_1.default.$disconnect());
