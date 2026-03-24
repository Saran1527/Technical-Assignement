import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { env } from './config/env';
import authRoutes from './auth/auth.routes';
import projectRoutes from './projects/project.routes';
import taskRoutes from './tasks/task.routes';
import notificationRoutes from './notifications/notification.routes';
import activityRoutes from './activities/activity.routes';
import { initOverdueJob } from './jobs/overdue-scheduler';

console.log('Starting server...');
const app = express();
console.log('App created');
const httpServer = createServer(app);
console.log('HTTP Server created');
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
console.log('Socket.io initialized');

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/health', (req, res) => res.send('OK'));

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/activities', activityRoutes);

initOverdueJob();

io.on('connection', (socket) => {
  console.log('socket connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('socket disconnected:', socket.id);
  });
});

const PORT = env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export { io };
