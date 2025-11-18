// src/__tests__/helpers.ts
import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const createTestUser = async (overrides: any = {}) => {
  const hashedPassword = await argon2.hash('Password123!');

  return await prisma.user.create({
    data: {
      name: 'testuser', // Changed from 'username' to 'name'
      email: 'test@example.com',
      password: hashedPassword,
      ...overrides,
    },
  });
};

export const createTestTask = async (userId: string, overrides: any = {}) => {
  return await prisma.task.create({
    data: {
      title: 'Test Task',
      description: 'Test Description',
      status: 'PENDING',
      priority: 'MEDIUM',
      userId,
      ...overrides,
    },
  });
};

export const createTestComment = async (taskId: string, userId: string, overrides: any = {}) => {
  return await prisma.comment.create({
    data: {
      content: 'Test Comment',
      taskId,
      userId,
      ...overrides,
    },
  });
};

export const generateTestToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'test-secret', {
    expiresIn: '1h',
  });
};

export const cleanDatabase = async () => {
  await prisma.comment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();
};
