// apps/api/src/modules/developer/interface/routes/developer.routes.ts
import { Router } from 'express';
import type { Response } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../../../../shared/utils/async-handler';
import { authMiddleware, type AuthenticatedRequest } from '../../../../shared/middleware/auth.middleware';
import { developerGuard } from '../../../../shared/middleware/developer.middleware';
import { validate } from '../../../../shared/middleware/validate.middleware';
import { sendPaginated, sendSuccess } from '../../../../shared/utils/http';
import { DeveloperUseCases } from '../../application/use-cases/DeveloperUseCases';

const useCases = new DeveloperUseCases();
export const developerRouter = Router();
developerRouter.use(authMiddleware);
developerRouter.use(developerGuard);

/**
 * @swagger
 * /api/developer/system:
 *   get:
 *     summary: Métricas del proceso
 *     tags: [Developer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: CPU, RAM, heap, latencias
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
developerRouter.get(
  '/system',
  asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
    sendSuccess(res, await useCases.system());
  }),
);
developerRouter.get(
  '/services',
  asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
    sendSuccess(res, await useCases.services());
  }),
);
developerRouter.get(
  '/logs',
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const result = await useCases.logs({
      level: typeof req.query.level === 'string' ? req.query.level : undefined,
      search: typeof req.query.search === 'string' ? req.query.search : undefined,
      page: Number(req.query.page),
      limit: Number(req.query.limit),
    });
    sendPaginated(res, result.data, result.total, result.page, result.limit);
  }),
);
developerRouter.get(
  '/audit',
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const result = await useCases.audit({
      userId: typeof req.query.userId === 'string' ? req.query.userId : undefined,
      entity: typeof req.query.entity === 'string' ? req.query.entity : undefined,
      page: Number(req.query.page),
      limit: Number(req.query.limit),
    });
    sendPaginated(res, result.data, result.total, result.page, result.limit);
  }),
);
developerRouter.get(
  '/jobs',
  asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
    sendSuccess(res, await useCases.jobs());
  }),
);
developerRouter.post(
  '/jobs/:name/trigger',
  validate({ params: z.object({ name: z.string() }) }),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    sendSuccess(res, await useCases.triggerJob(req.params.name));
  }),
);
developerRouter.get(
  '/env-check',
  asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
    sendSuccess(res, useCases.envCheck());
  }),
);
