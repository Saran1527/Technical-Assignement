import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { TaskService } from './task.service';
import { TaskStatus } from '@prisma/client';

export class TaskController {
  static async create(req: AuthRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const task = await TaskService.create(req.body, req.user.userId);
      res.status(201).json(task);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async updateStatus(req: AuthRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const { status } = req.body;
      const task = await TaskService.updateStatus(req.params.id, status as TaskStatus, req.user.userId, req.user.role);
      res.json(task);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async getAll(req: AuthRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const tasks = await TaskService.getAll(req.user.userId, req.user.role, req.query);
      res.json(tasks);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
