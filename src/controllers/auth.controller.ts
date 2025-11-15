import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authService } from '../services/auth.service.js';
import { ApiError } from '../utils/ApiError.js';

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.registerUser(req.body);
  res.status(201).json(user);
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const { user, token } = await authService.loginUser(email, password);

  res.status(200).json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    token,
  });
});

export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) throw ApiError.badRequest('Token required');

  await authService.logoutUser(token);
  res.status(200).json({ message: 'Logged out successfully' });
});
