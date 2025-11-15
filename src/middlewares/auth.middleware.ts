import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import prisma from '../config/db.js';

/**
 * JWT payload interface (Prisma uses number id)
 */
interface JwtPayload {
  id: number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * Middleware to authenticate user using JWT
 */
export const authenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Access token is required');
    }

    const token = authHeader.substring(7);

    if (!token) {
      throw ApiError.unauthorized('Access token is missing');
    }

    try {
      const jwtSecret = process.env.JWT_SECRET;

      if (!jwtSecret) {
        throw ApiError.internal('JWT secret is not configured');
      }

      const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

      // 🔹 Fetch user from Prisma (without password)
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
        throw ApiError.unauthorized('User not found. Token is invalid.');
      }

      // Attach user to req object
      req.user = {
        id: user.id.toString(), // convert number → string for route comparison
        email: user.email,
        name: user.name,
        role: user.role,
      };

      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw ApiError.unauthorized('Token expired. Please login again.');
      }

      if (error instanceof jwt.JsonWebTokenError) {
        throw ApiError.unauthorized('Invalid token. Please login again.');
      }

      if (error instanceof jwt.NotBeforeError) {
        throw ApiError.unauthorized('Token not active yet');
      }

      if (error instanceof ApiError) {
        throw error;
      }

      throw ApiError.unauthorized('Authentication failed');
    }
  },
);

/**
 * Role-based authorization
 */
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw ApiError.unauthorized('User not authenticated');
    }

    if (!roles.includes(req.user.role)) {
      throw ApiError.forbidden(`Access denied. Requires roles: ${roles.join(', ')}`);
    }

    next();
  };
};

/**
 * Check if user owns the resource OR is admin
 */
export const authorizeOwnerOrAdmin = (userIdParam = 'id') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw ApiError.unauthorized('User not authenticated');
    }

    const resourceUserId = req.params[userIdParam];
    const currentUserId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isAdmin && resourceUserId !== currentUserId) {
      throw ApiError.forbidden('You can only access your own resources');
    }

    next();
  };
};
