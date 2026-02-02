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
exports.exportAttendanceToSheets = void 0;
const googleapis_1 = require("googleapis");
const db_1 = __importDefault(require("../config/db"));
// This service expects a Google Service Account JSON path or credentials in .env
// For local dev, we provide a placeholder pattern.
const exportAttendanceToSheets = (spreadsheetId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
        console.warn('[GOOGLE SHEETS] Missing credentials. Mocking export...');
        return { message: 'Google Sheets credentials missing. Configuration required.' };
    }
    try {
        const auth = new googleapis_1.google.auth.JWT({
            email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
        const sheets = googleapis_1.google.sheets({ version: 'v4', auth });
        // 1. Get Data
        const attendance = yield db_1.default.timeEntry.findMany({
            include: { user: true },
            orderBy: { clockIn: 'desc' }
        });
        // 2. Format Data for Sheets
        const rows = [
            ['Name', 'Email', 'Date', 'Clock In', 'Clock Out', 'Hours', 'Type'],
            ...attendance.map(entry => {
                var _a, _b;
                return [
                    entry.user.name,
                    entry.user.email,
                    entry.clockIn.toLocaleDateString(),
                    entry.clockIn.toLocaleTimeString(),
                    ((_a = entry.clockOut) === null || _a === void 0 ? void 0 : _a.toLocaleTimeString()) || 'ACTIVE',
                    ((_b = entry.hoursWorked) === null || _b === void 0 ? void 0 : _b.toString()) || '0',
                    entry.clockType
                ];
            })
        ];
        // 3. Update Sheet
        yield sheets.spreadsheets.values.update({
            spreadsheetId,
            range: 'Sheet1!A1',
            valueInputOption: 'RAW',
            requestBody: { values: rows },
        });
        return { success: true, rowsExported: attendance.length };
    }
    catch (error) {
        console.error('Google Sheets Export Failed:', error);
        throw error;
    }
});
exports.exportAttendanceToSheets = exportAttendanceToSheets;
