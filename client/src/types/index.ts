export enum UserRole {
  ADMIN = 'ADMIN',
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  DEVELOPER = 'DEVELOPER'
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  IN_REVIEW = 'IN_REVIEW',
  DONE = 'DONE',
  OVERDUE = 'OVERDUE'
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  managerId: string;
  manager?: User;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  projectId: string;
  project?: Project;
  developerId: string;
  developer?: { name: string };
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  taskId?: string;
  projectId: string;
  userId: string;
  user: { name: string };
  task?: { title: string };
  action: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
