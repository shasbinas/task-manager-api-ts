// src/__tests__/auth.test.ts
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../server.js';
import { cleanDatabase } from './helpers.js';

const prisma = new PrismaClient();

describe('Auth API', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'newuser', // Changed from 'username' to 'name'
        email: 'newuser@example.com',
        password: 'Password123!',
      };

      const response = await request(app).post('/api/auth/register').send(userData).expect(201);

      // Verify response structure
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email', userData.email);
      expect(response.body).toHaveProperty('name', userData.name);
      expect(response.body).toHaveProperty('role', 'user');
      expect(response.body).toHaveProperty('createdAt');

      console.log('✅ User registered successfully');
    }, 10000);
  });
});
