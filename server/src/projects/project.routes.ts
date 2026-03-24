import { Router } from 'express';
import { ProjectController } from './project.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.post('/', authorize([UserRole.ADMIN, UserRole.PROJECT_MANAGER]), ProjectController.create);
router.get('/', ProjectController.getAll);
router.get('/:id', ProjectController.getById);

export default router;
