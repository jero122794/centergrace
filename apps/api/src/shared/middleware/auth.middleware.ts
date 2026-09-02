// apps/api/src/shared/middleware/auth.middleware.ts
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../utils/app-error';
import type { Role } from '@prisma/client';

export interface AccessTokenPayload {
  sub: string;
  role: Role;
  mustChangePassword: boolean;
}

export interface AuthenticatedRequest extends Request {
  user?: AccessTokenPayload;
}

/**
 * Verifies the RS256 access token and attaches the principal to the request.
 */
export const authMiddleware = (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    next(AppError.unauthorized());
    return;
  }
  const token = header.slice('Bearer '.length);
  try {
    const payload = jwt.verify(token, env.JWT_PUBLIC_KEY, { algorithms: ['RS256'] });
    req.user = toAccessPayload(payload);
    next();
  } catch {
    next(AppError.unauthorized('Invalid or expired access token'));
  }
};

const toAccessPayload = (payload: string | jwt.JwtPayload): AccessTokenPayload => {
  if (typeof payload === 'string' || !payload.sub || !payload.role) {
    throw new Error('Invalid token payload');
  }
  return {
    sub: payload.sub,
    role: payload.role as Role,
    mustChangePassword: Boolean(payload.mustChangePassword),
  };
};
