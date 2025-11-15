import prisma from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

export const userService = {
  // Get all users (without password)
  async getAllUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  },

  // Create a new user
  async createUser(data: { name: string; email: string; password: string; role?: string }) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw ApiError.conflict('Email already exists');
    }

    return prisma.user.create({
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  },

  // Get user by ID (without password)
  async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    return user;
  },

  // Delete user
  async deleteUser(id: string) {
    try {
      return await prisma.user.delete({
        where: { id: Number(id) },
      });
    } catch {
      throw ApiError.notFound('User not found');
    }
  },

  // Update user
  async updateUser(
    id: string,
    data: Partial<{ name: string; email: string; password: string; role: string }>,
  ) {
    try {
      return await prisma.user.update({
        where: { id: Number(id) },
        data,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });
    } catch {
      throw ApiError.notFound('User not found');
    }
  },
};
