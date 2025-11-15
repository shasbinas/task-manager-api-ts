declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number; // FIXED → must be number (Prisma Int)
        email: string;
        name: string; // Prisma field
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
