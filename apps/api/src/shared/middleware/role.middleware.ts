// apps/api/src/shared/middleware/role.middleware.ts
import type { NextFunction, Response } from 'express';
import type { Role } from '@prisma/client';
import { AppError } from '../utils/app-error';
import type { AuthenticatedRequest } from './auth.middleware';

/**
 * Restricts a route to an explicit allow-list of roles.
 */
export const requireRoles =
  (allowed: readonly Role[]) =>
  (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    const role = req.user?.role;
    if (!role || !allowed.includes(role)) {
      next(AppError.forbidden());
      return;
    }
    next();
  };
