import { Router } from 'express';
import * as leaveController from '../controllers/leave.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/request', leaveController.createRequest);
router.get('/my-requests', leaveController.getMyRequests);
router.get('/balance', leaveController.getBalance);
router.get('/all', requireRole(['ADMIN', 'HR']), leaveController.getAllRequests);
router.put('/:id/approve', requireRole(['ADMIN', 'HR']), leaveController.approveRequest);
router.put('/:id/reject', requireRole(['ADMIN', 'HR']), leaveController.rejectRequest);

export default router;
