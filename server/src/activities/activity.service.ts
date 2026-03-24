import prisma from '../lib/prisma';
import { UserRole } from '@prisma/client';

export class ActivityService {
  static async getHistory(userId: string, role: UserRole, limit = 20) {
    const where: any = {};

    if (role === UserRole.PROJECT_MANAGER) {
      where.project = { managerId: userId };
    } else if (role === UserRole.DEVELOPER) {
      where.taskId = {
        in: await prisma.task.findMany({
          where: { developerId: userId },
          select: { id: true }
        }).then(tasks => tasks.map(t => t.id))
      };
    }

    return prisma.activityLog.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: limit,
      include: {
        user: { select: { name: true } },
        task: { select: { title: true } }
      }
    });
  }
}
