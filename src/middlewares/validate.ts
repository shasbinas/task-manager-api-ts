import type { Request, Response, NextFunction } from 'express';
import type { ValidationErrorItem } from 'joi';
import { ApiError } from '../utils/ApiError.js';

export const validate = (schema: any, location: 'body' | 'params' | 'query' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = req[location];

    const { error, value } = schema.validate(data, { abortEarly: false });

    if (error) {
      const msg = error.details.map((d: ValidationErrorItem) => d.message).join(', ');
      throw ApiError.badRequest(msg);
    }

    // Store validated data safely
    if (!req.validatedData) req.validatedData = {};
    req.validatedData[location] = value;

    // Replace the source only for body/params/query
    req[location] = value;

    next();
  };
};
