// apps/api/src/shared/middleware/developer.middleware.ts
import type { NextFunction, Response } from 'express';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/app-error';
import type { AuthenticatedRequest } from './auth.middleware';

/**
 * Double-checks DEVELOPER role on the token and in the database.
 */
export const developerGuard = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (req.user?.role !== 'DEVELOPER') {
      throw AppError.forbidden('Developer panel is restricted');
    }
    const user = await prisma.user.findUnique({
      where: { id: req.user.sub },
      select: { role: true, isActive: true },
    });
    if (!user || user.role !== 'DEVELOPER' || !user.isActive) {
      throw AppError.forbidden('Developer panel is restricted');
    }
    next();
  } catch (error) {
    next(error);
  }
};
