import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { NotificationService } from './notification.service';

export class NotificationController {
  static async getForUser(req: AuthRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const notifications = await NotificationService.getForUser(req.user.userId);
      res.json(notifications);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async markRead(req: AuthRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      await NotificationService.markRead(req.params.id, req.user.userId);
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async markAllRead(req: AuthRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      await NotificationService.markAllRead(req.user.userId);
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
