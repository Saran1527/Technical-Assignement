import prisma from '../lib/prisma';
import { UserRole } from '@prisma/client';

export class ProjectService {
  static async create(data: { name: string; description?: string; clientId?: string; managerId: string }) {
    return prisma.project.create({
      data,
    });
  }

  static async getAll(userId: string, role: UserRole) {
    if (role === UserRole.ADMIN) {
      return prisma.project.findMany({
        include: { manager: { select: { name: true, email: true } } },
      });
    }
    if (role === UserRole.PROJECT_MANAGER) {
      return prisma.project.findMany({
        where: { managerId: userId },
      });
    }
    // Developers don't see projects directly if not assigned to tasks in them? 
    // Usually they see projects they are involved in.
    return prisma.project.findMany({
      where: {
        tasks: {
          some: { developerId: userId },
        },
      },
      distinct: ['id'],
    });
  }

  static async getById(id: string, userId: string, role: UserRole) {
    const project = await prisma.project.findUnique({
      where: { id },
      include: { tasks: true },
    });

    if (!project) throw new Error('Project not found');

    if (role === UserRole.PROJECT_MANAGER && project.managerId !== userId) {
      throw new Error('Access denied');
    }

    if (role === UserRole.DEVELOPER) {
      const isAssigned = await prisma.task.findFirst({
        where: { projectId: id, developerId: userId },
      });
      if (!isAssigned) throw new Error('Access denied');
    }

    return project;
  }
}
