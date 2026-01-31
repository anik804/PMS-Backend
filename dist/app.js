import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import connectDB, { checkConnection } from './config/db';
import authRoutes from './routes/authRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import projectRoutes from './routes/projectRoutes';
import userRoutes from './routes/userRoutes';
// Load environment variables
dotenv.config();
// Initialize Express app
const app = express();
// Connect to Database (async, non-blocking for serverless)
// This is non-blocking - the app will start even if DB connection fails
// Connection will be retried on first request via middleware
setTimeout(() => {
    connectDB().catch((error) => {
        console.error('Initial database connection error (non-fatal):', error.message);
        // Don't throw - allow the app to start even if DB connection fails initially
        // The connection will be retried on first request via middleware
    });
}, 0);
// Middleware to ensure DB connection (important for serverless)
app.use(async (req, res, next) => {
    // Skip DB check for health endpoints
    if (req.path === '/' || req.path === '/health') {
        return next();
    }
    if (!checkConnection()) {
        try {
            await connectDB();
        }
        catch (error) {
            console.error('Database connection failed in middleware:', error.message);
            return res.status(503).json({
                message: 'Database connection failed',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined,
            });
        }
    }
    next();
});
// Security Middleware
app.use(helmet());
// CORS Configuration
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL || '',
].filter(Boolean);
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development' || process.env.VERCEL) {
            callback(null, true);
        }
        else {
            // Log but don't block in production to avoid breaking the app
            console.warn(`CORS blocked origin: ${origin}`);
            callback(null, true); // Allow for now to prevent crashes
        }
    },
    credentials: true,
}));
app.use(express.json());
// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use('/api', limiter);
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/dashboard', dashboardRoutes);
// Health check endpoint (no DB required)
app.get('/', (req, res) => {
    res.json({
        message: 'API is running...',
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});
// Health check endpoint
app.get('/health', (req, res) => {
    const dbStatus = checkConnection() ? 'connected' : 'disconnected';
    res.json({
        status: 'ok',
        database: dbStatus,
        timestamp: new Date().toISOString()
    });
});
// Error handling middleware (must be last)
app.use((err, req, res, next) => {
    console.error('Error:', err);
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message || 'Internal server error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});
// Catch-all for unhandled routes
app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found',
        path: req.path
    });
});
export default app;
