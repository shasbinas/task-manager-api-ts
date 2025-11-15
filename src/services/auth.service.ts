import { cacheService } from './cache.service.js';
import { generateToken } from '../utils/generateToken.js';
import { ApiError } from '../utils/ApiError.js';
import argon2 from 'argon2';
import prisma from '../config/db.js';

export class AuthService {
  async registerUser(data: { name: string; email: string; password: string; role?: string }) {
    const { name, email, password, role } = data;

    // 1) Check cache
    const cachedUser = await cacheService.getCachedUser(email);
    if (cachedUser) {
      throw ApiError.conflict('User already exists (cached)');
    }

    // 2) Check DB
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) throw ApiError.conflict('User already exists');

    // 3) Hash password
    const hashedPassword = await argon2.hash(password);

    // 4) Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'user',
      },
    });

    // 5) Cache email → user
    await cacheService.cacheUser(email, user);

    return user;
  }

  async loginUser(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw ApiError.unauthorized('Invalid credentials');

    // Check password
    const isMatch = await argon2.verify(user.password, password);
    if (!isMatch) throw ApiError.unauthorized('Invalid credentials');

    // ✔ Correct token payload
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Store session in Redis
    await cacheService.createSession(token, user.id.toString(), 86400);

    return { user, token };
  }

  async logoutUser(token: string) {
    await cacheService.blacklistToken(token, 86400);
  }
}

export const authService = new AuthService();
