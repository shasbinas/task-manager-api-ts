import type { Request, Response, NextFunction } from 'express';
import type { ValidationErrorItem } from 'joi';
import { ApiError } from '../utils/ApiError.js';

export const validate = (schema: any) => (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = schema.validate(req.body);

  if (error) {
    const msg = error.details.map((d: ValidationErrorItem) => d.message).join(', ');
    throw ApiError.badRequest(msg);
  }

  req.body = value;
  next();
};
