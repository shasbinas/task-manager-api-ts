declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string; // Prisma ID
        email: string;
        name: string; // Prisma field (not username)
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
