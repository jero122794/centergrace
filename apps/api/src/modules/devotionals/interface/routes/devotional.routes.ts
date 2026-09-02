// apps/api/src/modules/devotionals/interface/routes/devotional.routes.ts
import { Router } from 'express';
import type { Response } from 'express';
import { asyncHandler } from '../../../../shared/utils/async-handler';
import { authMiddleware, type AuthenticatedRequest } from '../../../../shared/middleware/auth.middleware';
import { requireRoles } from '../../../../shared/middleware/role.middleware';
import { validate } from '../../../../shared/middleware/validate.middleware';
import { sendSuccess } from '../../../../shared/utils/http';
import { AppError } from '../../../../shared/utils/app-error';
import {
  createDevotionalBodySchema,
  devotionalIdParamsSchema,
  participateBodySchema,
} from '../../application/dtos/devotional.dto';
import { DevotionalUseCases } from '../../application/use-cases/DevotionalUseCases';
import { prisma } from '../../../../shared/config/prisma';

const useCases = new DevotionalUseCases();
export const devotionalRouter = Router();
devotionalRouter.use(authMiddleware);

const userId = (req: AuthenticatedRequest): string => {
  if (!req.user) {
    throw AppError.unauthorized();
  }
  return req.user.sub;
};

/**
 * @swagger
 * /api/devotionals/today:
 *   get:
 *     summary: Devocional del día
 *     tags: [Devotionals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Devocional visible para el estudiante
 */
devotionalRouter.get(
  '/today',
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    sendSuccess(res, await useCases.today(userId(req)));
  }),
);
devotionalRouter.get(
  '/history',
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    sendSuccess(res, await useCases.history(userId(req)));
  }),
);
devotionalRouter.get(
  '/',
  requireRoles(['DEVELOPER', 'ADMIN', 'LEADER']),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const where = req.user?.role === 'LEADER' ? { authorId: req.user.sub } : {};
    sendSuccess(res, await prisma.devotional.findMany({ where, orderBy: { date: 'desc' } }));
  }),
);
devotionalRouter.post(
  '/',
  requireRoles(['DEVELOPER', 'ADMIN', 'LEADER']),
  validate({ body: createDevotionalBodySchema }),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    sendSuccess(res, await useCases.create(userId(req), req.body), 201);
  }),
);
devotionalRouter.post(
  '/:id/participations',
  validate({ params: devotionalIdParamsSchema, body: participateBodySchema }),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    sendSuccess(res, await useCases.participate(userId(req), req.params.id, req.body), 201);
  }),
);
