import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import compression from 'compression';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());

// Health Check
app.get('/', (req, res) => {
    res.json({ message: 'Rudratic HR System API is running', timestamp: new Date() });
});

app.get('/api', (req, res) => {
    res.json({
        status: 'Operational',
        version: '1.0.0-GA',
        latency: 'minimal',
        compression: 'enabled'
    });
});

// Routes
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import userRoutes from './routes/user.routes';
import timeEntryRoutes from './routes/timeEntry.routes';
import notificationRoutes from './routes/notification.routes';
import holidayRoutes from './routes/holiday.routes';
import leaveRoutes from './routes/leave.routes';
import profileRoutes from './routes/profile.routes';
import reportRoutes from './routes/report.routes';
import announcementRoutes from './routes/announcement.routes';
import ticketRoutes from './routes/ticket.routes';
import calendarRoutes from './routes/calendar.routes';
import kudosRoutes from './routes/kudos.routes';
import aiRoutes from './routes/ai.routes';
import { initCronJobs } from './services/cron.service';

// Initialize Scheduled Tasks
initCronJobs();

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/holidays', holidayRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/time', timeEntryRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/kudos', kudosRoutes);
app.use('/api/ai', aiRoutes);

export default app;
