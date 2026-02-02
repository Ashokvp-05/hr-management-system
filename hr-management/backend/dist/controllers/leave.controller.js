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
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectRequest = exports.approveRequest = exports.getAllRequests = exports.getBalance = exports.getMyRequests = exports.createRequest = void 0;
const leaveService = __importStar(require("../services/leave.service"));
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const createRequestSchema = zod_1.z.object({
    type: zod_1.z.nativeEnum(client_1.LeaveType),
    startDate: zod_1.z.string().datetime().or(zod_1.z.string()), // Accept ISO string
    endDate: zod_1.z.string().datetime().or(zod_1.z.string()),
    reason: zod_1.z.string().optional()
});
const createRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const validation = createRequestSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: validation.error.errors });
        }
        const data = validation.data;
        const request = yield leaveService.createRequest({
            userId,
            type: data.type,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            reason: data.reason
        });
        res.json(request);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.createRequest = createRequest;
const getMyRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const requests = yield leaveService.getUserRequests(userId);
        res.json(requests);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getMyRequests = getMyRequests;
const getBalance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const balance = yield leaveService.getBalance(userId);
        res.json(balance);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getBalance = getBalance;
const getAllRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requests = yield leaveService.getAllRequests();
        res.json(requests);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getAllRequests = getAllRequests;
const approveRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!adminId)
            return res.status(401).json({ error: 'Unauthorized' });
        const { id } = req.params;
        const request = yield leaveService.updateStatus(id, client_1.LeaveStatus.APPROVED, adminId);
        res.json(request);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.approveRequest = approveRequest;
const rejectRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!adminId)
            return res.status(401).json({ error: 'Unauthorized' });
        const { id } = req.params;
        const { reason } = req.body;
        const request = yield leaveService.updateStatus(id, client_1.LeaveStatus.REJECTED, adminId, reason);
        res.json(request);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.rejectRequest = rejectRequest;
