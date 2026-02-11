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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController = __importStar(require("../controllers/admin.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Middleware to check if user is admin should be added here
router.use(auth_middleware_1.authenticate); // Must be logged in
// Read-Only Routes (Manager Allowed)
router.get('/pending-users', (0, auth_middleware_1.authorize)(['ADMIN', 'SUPER_ADMIN', 'HR_ADMIN', 'OPS_ADMIN', 'FINANCE_ADMIN', 'SUPPORT_ADMIN', 'VIEWER_ADMIN', 'MANAGER']), adminController.getPendingUsers);
router.get('/stats', (0, auth_middleware_1.authorize)(['ADMIN', 'SUPER_ADMIN', 'HR_ADMIN', 'OPS_ADMIN', 'FINANCE_ADMIN', 'SUPPORT_ADMIN', 'VIEWER_ADMIN', 'MANAGER']), adminController.getStats);
router.get('/overview', (0, auth_middleware_1.authorize)(['ADMIN', 'SUPER_ADMIN', 'HR_ADMIN', 'OPS_ADMIN', 'FINANCE_ADMIN', 'SUPPORT_ADMIN', 'VIEWER_ADMIN', 'MANAGER']), adminController.getOverview);
router.get('/roles', (0, auth_middleware_1.authorize)(['ADMIN', 'SUPER_ADMIN', 'HR_ADMIN', 'OPS_ADMIN', 'MANAGER']), adminController.getRoles);
router.get('/audit-logs', (0, auth_middleware_1.authorize)(['ADMIN', 'SUPER_ADMIN', 'HR_ADMIN', 'OPS_ADMIN', 'MANAGER']), adminController.getAuditLogs);
// Write Routes (Manager Restricted)
router.post('/sync/sheets', (0, auth_middleware_1.authorize)(['ADMIN', 'SUPER_ADMIN', 'HR_ADMIN', 'OPS_ADMIN']), adminController.syncToSheets);
router.put('/users/:id/approve', (0, auth_middleware_1.authorize)(['ADMIN', 'SUPER_ADMIN', 'HR_ADMIN', 'OPS_ADMIN']), adminController.approveUser);
router.put('/users/:id/reject', (0, auth_middleware_1.authorize)(['ADMIN', 'SUPER_ADMIN', 'HR_ADMIN', 'OPS_ADMIN']), adminController.rejectUser);
exports.default = router;
