import 'express';

declare global {
  namespace Express {
    interface Request {
      user: {
        id: number; // Prisma user.id is Int → number
        email: string;
        name: string;
        role: string;
        [key: string]: any;
      };

      validatedData?: {
        body?: any;
        query?: any;
        params?: any;
      };
    }
  }
}

export {};
