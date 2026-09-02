// apps/api/src/modules/worship/interface/routes/worship.routes.ts
import { Router } from 'express';
import type { Response } from 'express';
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { asyncHandler } from '../../../../shared/utils/async-handler';
import { authMiddleware, type AuthenticatedRequest } from '../../../../shared/middleware/auth.middleware';
import { requireRoles } from '../../../../shared/middleware/role.middleware';
import { validate } from '../../../../shared/middleware/validate.middleware';
import { sendSuccess } from '../../../../shared/utils/http';
import { AppError } from '../../../../shared/utils/app-error';
import {
  addRehearsalSongBodySchema,
  applyAuditionBodySchema,
  createRehearsalBodySchema,
  createSongBodySchema,
  rehearsalIdParamsSchema,
  rehearsalSongParamsSchema,
  updateAuditionBodySchema,
  updateRehearsalSongBodySchema,
} from '../../application/dtos/worship.dto';
import { WorshipUseCases } from '../../application/use-cases/WorshipUseCases';
import { prisma } from '../../../../shared/config/prisma';

const useCases = new WorshipUseCases();
export const worshipRouter = Router();
worshipRouter.use(authMiddleware);

const actor = (req: AuthenticatedRequest) => {
  if (!req.user) {
    throw AppError.unauthorized();
  }
  return { id: req.user.sub, role: req.user.role };
};

/**
 * @swagger
 * /api/worship/songs:
 *   get:
 *     summary: Listar repertorio
 *     tags: [Worship]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string, example: "Cuan grande es Dios" }
 */
worshipRouter.get(
  '/songs',
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    sendSuccess(res, await useCases.listSongs(typeof req.query.q === 'string' ? req.query.q : undefined));
  }),
);
worshipRouter.post(
  '/songs',
  requireRoles(['DEVELOPER', 'ADMIN', 'LEADER']),
  validate({ body: createSongBodySchema }),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const body = req.body as z.infer<typeof createSongBodySchema>;
    sendSuccess(
      res,
      await useCases.createSong(actor(req).id, {
        ministryId: body.ministryId,
        title: body.title,
        artist: body.artist,
        originalKey: body.originalKey,
        chords: body.chords as Prisma.InputJsonValue,
        lyrics: body.lyrics,
        youtubeId: body.youtubeId,
        tags: body.tags,
      }),
      201,
    );
  }),
);
worshipRouter.get(
  '/rehearsals',
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const ministryId = typeof req.query.ministryId === 'string' ? req.query.ministryId : undefined;
    sendSuccess(res, await useCases.listRehearsals(ministryId));
  }),
);
worshipRouter.post(
  '/rehearsals',
  requireRoles(['DEVELOPER', 'ADMIN', 'LEADER']),
  validate({ body: createRehearsalBodySchema }),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    sendSuccess(res, await useCases.createRehearsal(actor(req).id, req.body), 201);
  }),
);
worshipRouter.get(
  '/rehearsals/:id',
  validate({ params: rehearsalIdParamsSchema }),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    sendSuccess(res, await useCases.getRehearsal(req.params.id));
  }),
);
worshipRouter.post(
  '/rehearsals/:id/songs',
  requireRoles(['DEVELOPER', 'ADMIN', 'LEADER']),
  validate({ params: rehearsalIdParamsSchema, body: addRehearsalSongBodySchema }),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    sendSuccess(res, await useCases.addRehearsalSong(req.params.id, req.body), 201);
  }),
);
worshipRouter.patch(
  '/rehearsals/:id/songs/:songId',
  requireRoles(['DEVELOPER', 'ADMIN', 'LEADER']),
  validate({
    params: rehearsalSongParamsSchema,
    body: updateRehearsalSongBodySchema,
  }),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    sendSuccess(res, await useCases.updateRehearsalSong(req.params.id, req.params.songId, req.body));
  }),
);
worshipRouter.post(
  '/auditions',
  validate({ body: applyAuditionBodySchema }),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    sendSuccess(res, await useCases.apply(actor(req).id, req.body.ministryId, req.body.musicalRole), 201);
  }),
);
worshipRouter.get(
  '/auditions',
  requireRoles(['DEVELOPER', 'ADMIN', 'LEADER']),
  asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
    sendSuccess(
      res,
      await prisma.audition.findMany({
        include: { user: { select: { id: true, name: true, email: true, role: true, isActive: true } } },
        orderBy: { createdAt: 'desc' },
      }),
    );
  }),
);
worshipRouter.patch(
  '/auditions/:id',
  requireRoles(['DEVELOPER', 'ADMIN', 'LEADER']),
  validate({ params: z.object({ id: z.string() }), body: updateAuditionBodySchema }),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    sendSuccess(res, await useCases.updateAudition(actor(req), req.params.id, req.body));
  }),
);
