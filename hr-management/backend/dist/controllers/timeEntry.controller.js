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
exports.getAllActiveUsers = exports.getSummary = exports.getHistory = exports.clockOut = exports.clockIn = exports.getActive = void 0;
const timeEntryService = __importStar(require("../services/timeEntry.service"));
const client_1 = require("@prisma/client");
const getActive = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const entry = yield timeEntryService.getActiveEntry(userId);
        res.json(entry);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getActive = getActive;
const clockIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const { type, location, isOnCall } = req.body;
        // Validate type
        if (!Object.values(client_1.ClockType).includes(type)) {
            return res.status(400).json({ error: 'Invalid clock type' });
        }
        const entry = yield timeEntryService.clockIn(userId, type, location, isOnCall);
        res.json(entry);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.clockIn = clockIn;
const clockOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const entry = yield timeEntryService.clockOut(userId);
        res.json(entry);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.clockOut = clockOut;
const getHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        // Pagination params
        const limit = parseInt(req.query.limit) || 10;
        const skip = parseInt(req.query.skip) || 0;
        const history = yield timeEntryService.getHistory(userId, limit, skip);
        res.json(history);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getHistory = getHistory;
const cache_1 = __importDefault(require("../config/cache"));
const getSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const cacheKey = `summary_${userId}`;
        const cached = cache_1.default.get(cacheKey);
        if (cached)
            return res.json(cached);
        const summary = yield timeEntryService.getSummary(userId);
        cache_1.default.set(cacheKey, summary, 300); // Cache for 5 mins
        res.json(summary);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getSummary = getSummary;
const getAllActiveUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const activeUsers = yield timeEntryService.getAllActiveUsers();
        res.json(activeUsers);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getAllActiveUsers = getAllActiveUsers;
