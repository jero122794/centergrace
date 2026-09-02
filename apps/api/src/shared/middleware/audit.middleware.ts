// apps/api/src/shared/middleware/audit.middleware.ts
import type { NextFunction, Response } from 'express';
import { prisma } from '../config/prisma';
import { logger } from '../utils/logger';
import type { AuthenticatedRequest } from './auth.middleware';

interface AuditOptions {
  action: string;
  entity: string;
  entityIdFrom?: 'params' | 'body';
  entityIdKey?: string;
}

/**
 * Persists a sensitive-action AuditLog after a successful mutating response.
 */
export const audit =
  (options: AuditOptions) =>
  (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    res.on('finish', () => {
      if (res.statusCode >= 400 || !req.user) {
        return;
      }
      const entityId = resolveEntityId(req, options);
      void prisma.auditLog
        .create({
          data: {
            userId: req.user.sub,
            action: options.action,
            entity: options.entity,
            entityId,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            metadata: req.user.role === 'DEVELOPER' ? { role: req.user.role, path: req.path } : undefined,
          },
        })
        .catch((error: Error) => {
          logger.error('Failed to write audit log', { context: 'audit', message: error.message });
        });
    });
    next();
  };

const resolveEntityId = (req: AuthenticatedRequest, options: AuditOptions): string => {
  const key = options.entityIdKey ?? 'id';
  if (options.entityIdFrom === 'body') {
    const value = (req.body as Record<string, unknown>)[key];
    return typeof value === 'string' ? value : 'unknown';
  }
  return req.params[key] ?? 'unknown';
};
