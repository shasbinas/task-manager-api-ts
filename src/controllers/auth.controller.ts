import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authService } from '../services/auth.service.js';

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.registerUser(req.body);
  res.status(201).json(user);
});
