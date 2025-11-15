import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import prisma from '../config/db.js';

/**
 * JWT payload interface
 */
interface JwtPayload {
  id: number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * Authenticate user using JWT
 */
export const authenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Access token is required');
    }

    const token = authHeader.substring(7); // remove "Bearer "

    try {
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) throw ApiError.internal('JWT secret missing');

      const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

      // Get user from database
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });

      if (!user) {
        throw ApiError.unauthorized('User not found. Invalid token.');
      }

      // Attach user to request
      req.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };

      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) throw ApiError.unauthorized('Token expired');
      if (error instanceof jwt.JsonWebTokenError) throw ApiError.unauthorized('Invalid token');
      if (error instanceof jwt.NotBeforeError) throw ApiError.unauthorized('Token not active');

      throw ApiError.unauthorized('Authentication failed');
    }
  },
);

/**
 * Role based authorization
 */
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw ApiError.unauthorized('User not authenticated');
    }

    if (!roles.includes(req.user.role)) {
      throw ApiError.forbidden(`Access denied. Required roles: ${roles.join(', ')}`);
    }

    next();
  };
};

/**
 * Check if user is owner OR admin
 */
export const authorizeOwnerOrAdmin = (userIdParam = 'id') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) throw ApiError.unauthorized('User not authenticated');

    const resourceUserId = Number(req.params[userIdParam]);
    const currentUserId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isAdmin && resourceUserId !== currentUserId) {
      throw ApiError.forbidden('You can access only your own resources');
    }

    next();
  };
};

/**
 * Admin only middleware
 */
export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    throw ApiError.forbidden('Admin access only');
  }
  next();
};

export const authMiddleware = authenticate;
