import { PrismaClient, UserRole, TaskStatus, TaskPriority } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);

  // 1. Create Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@agency.com' },
    update: {},
    create: {
      email: 'admin@agency.com',
      name: 'Admin User',
      password,
      role: UserRole.ADMIN,
    },
  });

  const pm1 = await prisma.user.upsert({
    where: { email: 'pm1@agency.com' },
    update: {},
    create: {
      email: 'pm1@agency.com',
      name: 'Suresh PM',
      password,
      role: UserRole.PROJECT_MANAGER,
    },
  });

  const pm2 = await prisma.user.upsert({
    where: { email: 'pm2@agency.com' },
    update: {},
    create: {
      email: 'pm2@agency.com',
      name: 'Anjali PM',
      password,
      role: UserRole.PROJECT_MANAGER,
    },
  });

  const devs: any[] = [];
  for (let i = 1; i <= 4; i++) {
    const dev = await prisma.user.upsert({
      where: { email: `dev${i}@agency.com` },
      update: {},
      create: {
        email: `dev${i}@agency.com`,
        name: `Developer ${i}`,
        password,
        role: UserRole.DEVELOPER,
      },
    });
    devs.push(dev);
  }

  // 2. Create Projects
  const p1 = await prisma.project.create({
    data: {
      name: 'E-commerce Redesign',
      description: 'Major overhaul of the client storefront.',
      managerId: pm1.id,
    },
  });

  const p2 = await prisma.project.create({
    data: {
      name: 'Mobile App v2',
      description: 'Adding social features to the mobile app.',
      managerId: pm1.id,
    },
  });

  const p3 = await prisma.project.create({
    data: {
      name: 'Internal HR Tool',
      description: 'Employee management system.',
      managerId: pm2.id,
    },
  });

  // 3. Create Tasks
  const statuses = [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.IN_REVIEW, TaskStatus.DONE];
  const priorities = [TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH, TaskPriority.CRITICAL];

  const createTask = async (title: string, projectId: string, devId: string, status: TaskStatus) => {
    const dueDate = new Date();
    if (status === TaskStatus.OVERDUE) {
      dueDate.setDate(dueDate.getDate() - 5); // 5 days ago
    } else {
      dueDate.setDate(dueDate.getDate() + 7); // Next week
    }

    const task = await prisma.task.create({
      data: {
        title,
        projectId,
        developerId: devId,
        status: status === TaskStatus.OVERDUE ? TaskStatus.TODO : status, // Overdue is a check, not initial state but I'll mark it as TODO and let background job (or manual set if I want) handle it. Requirement says "flagged as Overdue".
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        dueDate,
      },
    });

    if (status === TaskStatus.OVERDUE) {
      await prisma.task.update({
        where: { id: task.id },
        data: { status: TaskStatus.OVERDUE }
      });
    }

    // Add activity log
    await prisma.activityLog.create({
      data: {
        taskId: task.id,
        projectId,
        userId: pm1.id,
        action: `Task "${title}" was created and assigned to ${devs.find(d => d.id === devId)?.name}`,
      },
    });
  };

  // Project 1 tasks
  await createTask('Setup Next.js project', p1.id, devs[0].id, TaskStatus.DONE);
  await createTask('Design landing page', p1.id, devs[1].id, TaskStatus.IN_PROGRESS);
  await createTask('API Integration', p1.id, devs[0].id, TaskStatus.TODO);
  await createTask('Database Schema', p1.id, devs[2].id, TaskStatus.OVERDUE);
  await createTask('Testing Suite', p1.id, devs[3].id, TaskStatus.TODO);

  // Project 2 tasks
  await createTask('Auth Flow', p2.id, devs[0].id, TaskStatus.IN_REVIEW);
  await createTask('Push Notifications', p2.id, devs[1].id, TaskStatus.TODO);
  await createTask('Profile Page', p2.id, devs[2].id, TaskStatus.IN_PROGRESS);
  await createTask('CI/CD Setup', p2.id, devs[3].id, TaskStatus.OVERDUE);
  await createTask('Security Audit', p2.id, devs[0].id, TaskStatus.TODO);

  // Project 3 tasks
  await createTask('Employee Entry Form', p3.id, devs[2].id, TaskStatus.TODO);
  await createTask('Reports Dashboard', p3.id, devs[3].id, TaskStatus.TODO);
  await createTask('LDAP Sync', p3.id, devs[1].id, TaskStatus.TODO);
  await createTask('UI/UX Review', p3.id, devs[0].id, TaskStatus.TODO);
  await createTask('Documentation', p3.id, devs[2].id, TaskStatus.TODO);

  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
