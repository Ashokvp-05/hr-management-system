import { Router } from 'express';
import * as reportController from '../controllers/report.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

// Reports access (Admin and Manager allowed)
const ADMIN_MANAGER_ROLES = ['ADMIN', 'SUPER_ADMIN', 'HR_ADMIN', 'OPS_ADMIN', 'FINANCE_ADMIN', 'SUPPORT_ADMIN', 'VIEWER_ADMIN', 'MANAGER'];

router.get('/attendance', authorize(ADMIN_MANAGER_ROLES), reportController.getAttendanceReport);
router.get('/export/excel', authorize(ADMIN_MANAGER_ROLES), reportController.exportExcel);
router.get('/export/pdf', authorize(ADMIN_MANAGER_ROLES), reportController.exportPDF);

export default router;
