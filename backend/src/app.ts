import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// Routes
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import referralRoutes from './routes/referralRoutes';
import leaderboardRoutes from './routes/leaderboardRoutes';
import achievementRoutes from './routes/achievementRoutes';
import notificationRoutes from './routes/notificationRoutes';

// Middleware
import errorHandler from './middleware/errorMiddleware';

// Admin routes
import { getAdminStats, getAdminUsers, toggleUserStatus } from './controllers/adminController';
import protect from './middleware/authMiddleware';
import adminOnly from './middleware/adminMiddleware';

dotenv.config();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser(process.env.COOKIE_SECRET));

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Health check
app.get('/api/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'Tiranga Connect API is running 🇮🇳' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/notifications', notificationRoutes);

// Admin routes
app.get('/api/admin/stats', protect, adminOnly, getAdminStats);
app.get('/api/admin/users', protect, adminOnly, getAdminUsers);
app.put('/api/admin/users/:id/status', protect, adminOnly, toggleUserStatus);

// Error handler
app.use(errorHandler);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    error: 'NOT_FOUND',
  });
});

export default app;
