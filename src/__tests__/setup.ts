import { PrismaClient } from '@prisma/client';
import { redisClient } from '../config/redis.js';

const prisma = new PrismaClient();

// Setup before all tests
beforeAll(async () => {
  try {
    // Connect to test database
    await prisma.$connect();
    console.log('✅ Test Prisma connected');

    // Connect to Redis
    if (!redisClient.isOpen()) {
      await redisClient.connect();
    }

    // Set Redis to use test database (DB 1)
    await redisClient.select(1);

    console.log('✅ Test environment connected');
  } catch (error) {
    console.error('❌ Test setup failed:', error);
    throw error;
  }
}, 30000);

// Cleanup after each test
afterEach(async () => {
  try {
    await prisma.comment.deleteMany();
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();
    await redisClient.flushDb();
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
  }
});

// Cleanup after all tests - THIS IS IMPORTANT
afterAll(async () => {
  try {
    // Close all connections
    await prisma.$disconnect();
    await redisClient.disconnect();

    // Force close any remaining handles
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log('✅ Test environment disconnected');
  } catch (error) {
    console.error('❌ Test teardown failed:', error);
  }
}, 30000);

export { prisma };
