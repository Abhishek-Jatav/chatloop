// src/types/express.d.ts

import { User } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user: {
        sub: string; // JWT user ID
        email: string;
        iat: number;
        exp: number;
      };
    }
  }
}
