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
exports.getHolidays = exports.syncHolidays = void 0;
const db_1 = __importDefault(require("../config/db"));
const cache_1 = __importDefault(require("../config/cache"));
const HOLIDAYS_2026 = [
    { name: 'Makar Sankranti', date: '2026-01-14' },
    { name: 'Republic Day', date: '2026-01-26', isNational: true },
    { name: 'Holi', date: '2026-03-03' },
    { name: 'Id-ul-Fitr', date: '2026-03-21' },
    { name: 'Ram Navami', date: '2026-03-26' },
    { name: 'Mahavir Jayanti', date: '2026-03-31' },
    { name: 'Good Friday', date: '2026-04-03' },
    { name: 'Buddha Purnima', date: '2026-05-01' },
    { name: 'Bakrid / Eid al-Adha', date: '2026-05-27' },
    { name: 'Muharram', date: '2026-06-26' },
    { name: 'Independence Day', date: '2026-08-15', isNational: true },
    { name: 'Janmashtami', date: '2026-09-04' },
    { name: 'Gandhi Jayanti', date: '2026-10-02', isNational: true },
    { name: 'Dussehra', date: '2026-10-20' },
    { name: 'Diwali', date: '2026-11-08' },
    { name: 'Guru Nanak Jayanti', date: '2026-11-24' },
    { name: 'Christmas Day', date: '2026-12-25' },
];
const syncHolidays = (year) => __awaiter(void 0, void 0, void 0, function* () {
    // In a real app, this would fetch from an API like Nager.Date
    // For now, we seed hardcoded data for 2026
    const holidays = year === 2026 ? HOLIDAYS_2026 : [];
    console.log(`Syncing holidays for ${year}... Found ${holidays.length} entries.`);
    let createdCount = 0;
    for (const h of holidays) {
        const date = new Date(h.date);
        // Upsert to avoid duplicates
        yield db_1.default.holiday.upsert({
            where: { date: date },
            update: { name: h.name }, // Update name if changed
            create: {
                name: h.name,
                date: date,
                year: year,
                isFloater: false
                // isNational removed from schema but was in list. keeping simple.
            }
        });
        createdCount++;
    }
    cache_1.default.del(`holidays_${year}`);
    return { count: createdCount, message: `Synced ${createdCount} holidays for ${year}` };
});
exports.syncHolidays = syncHolidays;
const getHolidays = (year) => __awaiter(void 0, void 0, void 0, function* () {
    const key = `holidays_${year}`;
    const cached = cache_1.default.get(key);
    if (cached)
        return cached;
    const holidays = yield db_1.default.holiday.findMany({
        where: { year },
        orderBy: { date: 'asc' }
    });
    cache_1.default.set(key, holidays, 86400); // 24 hours
    return holidays;
});
exports.getHolidays = getHolidays;
