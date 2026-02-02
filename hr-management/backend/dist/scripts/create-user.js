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
        yield db_1.default.user.upsert({
            where: { email: 'ashokvp04@gmail.com' },
            update: {
                password: hashedPassword,
                status: 'ACTIVE'
            },
            create: {
                email: 'ashokvp04@gmail.com',
                name: 'Ashok V P',
                password: hashedPassword,
                status: 'ACTIVE'
            }
        });
        console.log('User created/updated successfully with password:', password);
    });
}
main()
    .catch(console.error)
    .finally(() => db_1.default.$disconnect());
