import { Router } from 'express';
import { TaskController } from './task.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.post('/', authorize([UserRole.ADMIN, UserRole.PROJECT_MANAGER]), TaskController.create);
router.patch('/:id/status', TaskController.updateStatus);
router.get('/', TaskController.getAll);

export default router;
