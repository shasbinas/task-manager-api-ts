import { Request, Response } from 'express';
import prisma from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

// GET all users (admin)
export const getUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: { id: 'asc' },
  });

  res.json({ success: true, data: users });
};

// GET user by id (admin)
export const getUserById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) throw ApiError.notFound('User not found');

  res.json({ success: true, data: user });
};

// UPDATE user role (admin)
export const updateUserRole = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { role } = req.body;

  if (!role) throw ApiError.badRequest('Role is required');

  const validRoles = ['user', 'admin'];
  if (!validRoles.includes(role)) {
    throw ApiError.badRequest('Invalid role. Must be user or admin');
  }

  const user = await prisma.user.update({
    where: { id },
    data: { role },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  res.json({ success: true, message: 'Role updated', data: user });
};

// DELETE user (admin)
export const deleteUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw ApiError.notFound('User not found');

  await prisma.user.delete({ where: { id } });

  res.json({ success: true, message: 'User deleted' });
};
