import prisma from '../lib/prisma';
import { UserRole, TaskStatus, TaskPriority } from '@prisma/client';
import { io } from '../index';

export class TaskService {
  static async create(data: { title: string; description?: string; projectId: string; developerId: string; priority: TaskPriority; dueDate: string }, userId: string) {
    // Check if project belongs to PM
    const project = await prisma.project.findUnique({ where: { id: data.projectId } });
    if (!project || project.managerId !== userId) throw new Error('Unauthorized project access');

    const task = await prisma.task.create({
      data: {
        ...data,
        dueDate: new Date(data.dueDate),
      },
    });

    // Create notification for developer
    await prisma.notification.create({
      data: {
        userId: data.developerId,
        message: `You have been assigned a new task: ${data.title}`,
      },
    });

    return task;
  }

  static async updateStatus(taskId: string, status: TaskStatus, userId: string, role: UserRole) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true },
    });

    if (!task) throw new Error('Task not found');

    // Role checks
    if (role === UserRole.DEVELOPER && task.developerId !== userId) {
      throw new Error('Access denied');
    }
    if (role === UserRole.PROJECT_MANAGER && task.project.managerId !== userId) {
      throw new Error('Access denied');
    }

    const oldStatus = task.status;
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { status },
    });

    // Log activity
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const action = `${user?.name} moved Task #${task.title} from ${oldStatus} -> ${status}`;
    
    const log = await prisma.activityLog.create({
      data: {
        taskId,
        projectId: task.projectId,
        userId,
        action,
      },
    });

    // Notify Project Manager if moved to IN_REVIEW
    if (status === TaskStatus.IN_REVIEW) {
      await prisma.notification.create({
        data: {
          userId: task.project.managerId,
          message: `Task "${task.title}" is ready for review.`,
        },
      });
    }

    // Broadcast via socket (simplified for now, filter logic will be in socket service)
    io.to(`project_${task.projectId}`).emit('activity', log);
    io.emit('global_activity', log); // For Admin

    return updatedTask;
  }

  static async getAll(userId: string, role: UserRole, filters: any) {
    const where: any = {};
    
    if (role === UserRole.DEVELOPER) {
      where.developerId = userId;
    } else if (role === UserRole.PROJECT_MANAGER) {
      where.project = { managerId: userId };
    }

    if (filters.status) where.status = filters.status;
    if (filters.priority) where.priority = filters.priority;
    if (filters.projectId) where.projectId = filters.projectId;

    return prisma.task.findMany({
      where,
      include: { project: true, developer: { select: { name: true } } },
      orderBy: [
        { priority: 'desc' },
        { dueDate: 'asc' }
      ]
    });
  }
}
