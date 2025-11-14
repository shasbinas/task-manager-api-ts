import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { PrismaClient } from '@prisma/client';

import { redisClient } from './config/redis.js';
import { apiLimiter } from './middlewares/rateLimiter.middleware.js';
import { errorHandler } from './middlewares/error.middleware.js';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Middlewares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(compression());
app.use(apiLimiter);

// Logs
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Connect DB + Redis before starting server
(async () => {
  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL connected');

    await redisClient.connect();
    console.log('⚡ Redis is ready:', redisClient.isReady());
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
})();

// Health check
app.get('/health', async (req, res) => {
  res.json({
    status: 'OK',
    timestamp: Date.now(),
    postgres: 'connected',
    redis: redisClient.isReady() ? 'connected' : 'disconnected',
  });
});

// Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);

// Error Handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/health`);
});

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);

  server.close(async () => {
    console.log('✅ HTTP server closed');

    try {
      await redisClient.disconnect();
      console.log('✅ Redis disconnected');

      // MongoDB will close automatically via mongoose
      process.exit(0);
    } catch (error) {
      console.error('❌ Error during shutdown:', error);
      process.exit(1);
    }
  });

  // Force close after 10 seconds
  setTimeout(() => {
    console.error('❌ Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;
