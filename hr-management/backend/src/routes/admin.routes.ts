import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Middleware to check if user is admin should be added here
router.use(authenticate); // Must be logged in
router.use(authorize(['ADMIN']));

router.get('/pending-users', adminController.getPendingUsers);
router.get('/stats', adminController.getStats);
router.post('/sync/sheets', adminController.syncToSheets);
router.put('/users/:id/approve', adminController.approveUser);
router.put('/users/:id/reject', adminController.rejectUser);


export default router;
