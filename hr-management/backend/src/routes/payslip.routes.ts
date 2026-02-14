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

// Admin/Finance routes
router.post('/upload', authorize(['ADMIN', 'SUPER_ADMIN', 'FINANCE_ADMIN']), upload.single('file'), payslipController.uploadPayslip);
router.post('/generate', authorize(['ADMIN', 'SUPER_ADMIN', 'FINANCE_ADMIN']), payslipController.generatePayslip);
router.get('/all', authorize(['ADMIN', 'SUPER_ADMIN', 'FINANCE_ADMIN']), payslipController.getAllPayslips);
router.patch('/:id/release', authorize(['ADMIN', 'SUPER_ADMIN', 'FINANCE_ADMIN']), payslipController.releasePayslip);
router.patch('/bulk-release', authorize(['ADMIN', 'SUPER_ADMIN', 'FINANCE_ADMIN']), payslipController.bulkRelease);
router.patch('/:id', authorize(['ADMIN', 'SUPER_ADMIN', 'FINANCE_ADMIN']), payslipController.updatePayslip);
router.delete('/:id', authorize(['ADMIN', 'SUPER_ADMIN', 'FINANCE_ADMIN']), payslipController.deletePayslip);

export default router;
