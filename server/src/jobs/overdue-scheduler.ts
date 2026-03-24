import cron from 'node-cron';
import prisma from '../lib/prisma';
import { TaskStatus } from '@prisma/client';

export const initOverdueJob = () => {
  // Run every hour
  cron.schedule('0 * * * *', async () => {
    console.log('⏰ Running overdue task check...');
    const now = new Date();
    
    await prisma.task.updateMany({
      where: {
        dueDate: { lt: now },
        status: { notIn: [TaskStatus.DONE, TaskStatus.OVERDUE] }
      },
      data: {
        status: TaskStatus.OVERDUE
      }
    });
  });
};
