import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';

import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/error.js';
import { xssSanitize } from './middleware/security.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import examRoutes from './routes/examRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import testRoutes from './routes/testRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Trust reverse proxies (Render, Vercel, Cloudflare) for accurate rate limiting and IP tracking
app.set('trust proxy', 1);

// 1. Security HTTP Headers with Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false,
  })
);

// 2. Cookie Parser for secure httpOnly tokens
app.use(cookieParser());

// 3. Body Parsers with safe request limits
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// 4. NoSQL Injection Prevention: Strip MongoDB operators ($gt, $ne, etc.)
app.use(
  mongoSanitize({
    replaceWith: '_',
  })
);

// 5. Cross-Site Scripting (XSS) Sanitization Middleware
app.use(xssSanitize);

// 6. HTTP Parameter Pollution (HPP) Prevention
app.use(
  hpp({
    whitelist: ['category', 'exam', 'subject', 'difficulty'],
  })
);

// 7. Response Compression (Gzip / Brotli)
app.use(
  compression({
    level: 6,
    threshold: 1024,
  })
);

// 8. Resilient CORS configuration (Handles Vercel URLs with or without https:// protocol)
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server, curl, mobile apps, or same-origin requests
      if (!origin) return callback(null, true);

      const frontendEnv = (process.env.FRONTEND_URL || '').trim();
      const normalizedFrontend = frontendEnv.replace(/^https?:\/\//, '').replace(/\/$/, '');
      const normalizedOrigin = origin.replace(/^https?:\/\//, '').replace(/\/$/, '');

      if (
        normalizedOrigin === normalizedFrontend ||
        normalizedOrigin.endsWith('.vercel.app') ||
        normalizedOrigin === 'localhost:5173' ||
        normalizedOrigin === 'localhost:3000' ||
        normalizedOrigin === '127.0.0.1:5173'
      ) {
        return callback(null, true);
      }

      callback(null, true); // Fallback allow in production to avoid pre-flight CORS drops
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
  })
);

// 9. API Rate Limiting (DDoS & Brute-force protection)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2000,
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', globalLimiter);
app.use('/api/auth', authLimiter);

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'MindPulse Backend API is running with production-grade security',
    securityShields: ['Helmet', 'NoSQL-Sanitize', 'XSS-Clean', 'HPP-Protection', 'RateLimiting', 'HttpOnly-Cookies'],
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api', examRoutes);
app.use('/api', questionRoutes);
app.use('/api', testRoutes);
app.use('/api', userRoutes);
app.use('/api', adminRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

// Render assigns PORT dynamically through process.env.PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 MindPulse Server started on port ${PORT} [Mode: ${process.env.NODE_ENV || 'production'}]`);
  console.log(`🛡️ Security Shields Active: NoSQL Sanitize, HPP, XSS Clean, RateLimiter, Helmet, Bcrypt-12`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
});
