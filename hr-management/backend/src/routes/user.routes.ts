import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);
router.use(requireRole(['ADMIN'])); // All user management requires Admin

router.get('/', userController.getUsers);
router.put('/:id', userController.updateUser);

export default router;
