import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';
import { config } from './config';
import { connectDB } from './config/database.config';
import { errorMiddleware } from './middleware/error.middleware';
import { authRouter } from './routes/auth.route';
import { validateEnv, loadedEnvFile } from './utils/env.utils';

// validate environment variables before starting the server
validateEnv();

// connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: config.allowedOrigins,
  credentials: true,
}));


// Health check route
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api/auth', authRouter);

// Global error handler
app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT} in ${process.env.NODE_ENV || 'development'} mode (using ${loadedEnvFile})`);
});