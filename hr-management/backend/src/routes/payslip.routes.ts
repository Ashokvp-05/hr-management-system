import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import * as payslipController from '../controllers/payslip.controller';
import multer from 'multer';

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

const router = Router();

router.use(authenticate);

// Employee routes
router.get('/my', payslipController.getMyPayslips);
router.get('/:id/download', payslipController.downloadPayslip);

// Admin/Manager routes
router.post('/upload', authorize(['ADMIN', 'MANAGER']), upload.single('file'), payslipController.uploadPayslip);
router.get('/all', authorize(['ADMIN', 'MANAGER']), payslipController.getAllPayslips);

export default router;
