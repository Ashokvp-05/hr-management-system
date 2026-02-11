"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.getAuditLogs = exports.getRoles = exports.syncToSheets = exports.getOverview = exports.getStats = exports.rejectUser = exports.approveUser = exports.getPendingUsers = void 0;
const adminService = __importStar(require("../services/admin.service"));
const googleSheets = __importStar(require("../services/googleSheets.service"));
const db_1 = __importDefault(require("../config/db"));
const getPendingUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield adminService.getPendingUsers();
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getPendingUsers = getPendingUsers;
const approveUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        // @ts-ignore - req.user is populated by authenticate middleware
        const adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const user = yield adminService.approveUser(id, adminId);
        res.json({ message: 'User approved', user });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.approveUser = approveUser;
const rejectUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        // @ts-ignore
        const adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const user = yield adminService.rejectUser(id, adminId);
        res.json({ message: 'User rejected', user });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.rejectUser = rejectUser;
const cache_1 = __importDefault(require("../config/cache"));
const getStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cached = cache_1.default.get("admin_stats");
        if (cached)
            return res.json(cached);
        const stats = yield adminService.getDatabaseStats();
        cache_1.default.set("admin_stats", stats, 300); // Cache for 5 mins
        res.json(stats);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getStats = getStats;
const getOverview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cached = cache_1.default.get("admin_overview");
        if (cached)
            return res.json(cached);
        const overview = yield adminService.getDashboardOverview();
        cache_1.default.set("admin_overview", overview, 60); // Cache for 1 min
        res.json(overview);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getOverview = getOverview;
const syncToSheets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { spreadsheetId } = req.body;
        if (!spreadsheetId) {
            return res.status(400).json({ error: 'spreadsheetId is required' });
        }
        const result = yield googleSheets.exportAttendanceToSheets(spreadsheetId);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.syncToSheets = syncToSheets;
const getRoles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roles = yield db_1.default.role.findMany();
        res.json(roles);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getRoles = getRoles;
const getAuditLogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch top 50 logs
        const logs = yield db_1.default.auditLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50
        });
        // Manually join Admin details (Name & Position)
        const adminIds = [...new Set(logs.map(log => log.adminId))].filter(Boolean);
        const admins = yield db_1.default.user.findMany({
            where: { id: { in: adminIds } },
            select: { id: true, name: true, designation: true, department: true }
        });
        const adminMap = admins.reduce((acc, admin) => {
            acc[admin.id] = admin;
            return acc;
        }, {});
        const enrichedLogs = logs.map(log => (Object.assign(Object.assign({}, log), { admin: adminMap[log.adminId] || { name: 'Unknown System', designation: 'System' } })));
        res.json(enrichedLogs);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getAuditLogs = getAuditLogs;
