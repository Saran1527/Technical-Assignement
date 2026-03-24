import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { ActivityService } from './activity.service';

export class ActivityController {
  static async getHistory(req: AuthRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const activities = await ActivityService.getHistory(req.user.userId, req.user.role);
      res.json(activities);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
