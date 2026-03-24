import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { ProjectService } from './project.service';
import { UserRole } from '@prisma/client';

export class ProjectController {
  static async create(req: AuthRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const data = { ...req.body, managerId: req.user.userId };
      const project = await ProjectService.create(data);
      res.status(201).json(project);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async getAll(req: AuthRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const projects = await ProjectService.getAll(req.user.userId, req.user.role);
      res.json(projects);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async getById(req: AuthRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const project = await ProjectService.getById(req.params.id, req.user.userId, req.user.role);
      res.json(project);
    } catch (err: any) {
      res.status(403).json({ error: err.message });
    }
  }
}
