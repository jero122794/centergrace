// apps/api/src/modules/spiritual-notes/interface/routes/spiritual-note.routes.ts
import { Router } from 'express';
import type { Response } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../../../../shared/utils/async-handler';
import { authMiddleware, type AuthenticatedRequest } from '../../../../shared/middleware/auth.middleware';
import { requireRoles } from '../../../../shared/middleware/role.middleware';
import { validate } from '../../../../shared/middleware/validate.middleware';
import { sendSuccess } from '../../../../shared/utils/http';
import { AppError } from '../../../../shared/utils/app-error';
import { prisma, USER_PUBLIC_SELECT } from '../../../../shared/config/prisma';
import { audit } from '../../../../shared/middleware/audit.middleware';

const createNoteSchema = z.object({
  userId: z.string().min(1),
  groupId: z.string().min(1),
  content: z.string().min(3).max(8000),
});

const listNotesQuerySchema = z.object({
  userId: z.string().min(1).optional(),
  groupId: z.string().min(1).optional(),
});

export const spiritualNoteRouter = Router();
spiritualNoteRouter.use(authMiddleware);
spiritualNoteRouter.use(requireRoles(['DEVELOPER', 'ADMIN', 'LEADER']));

/**
 * @swagger
 * /api/spiritual-notes:
 *   post:
 *     summary: Crear nota espiritual privada
 *     tags: [SpiritualNotes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Nota creada
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
spiritualNoteRouter.post(
  '/',
  validate({ body: createNoteSchema }),
  audit({ action: 'SPIRITUAL_NOTE_CREATE', entity: 'SpiritualNote', entityIdFrom: 'body', entityIdKey: 'userId' }),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw AppError.unauthorized();
    }
    if (req.user.role === 'LEADER') {
      const group = await prisma.group.findUnique({ where: { id: req.body.groupId } });
      if (!group || group.leaderId !== req.user.sub) {
        throw AppError.forbidden();
      }
    }
    const note = await prisma.spiritualNote.create({
      data: {
        userId: req.body.userId,
        leaderId: req.user.sub,
        groupId: req.body.groupId,
        content: req.body.content,
      },
    });
    sendSuccess(res, note, 201);
  }),
);

spiritualNoteRouter.get(
  '/',
  validate({ query: listNotesQuerySchema }),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw AppError.unauthorized();
    }
    const userId = typeof req.query.userId === 'string' ? req.query.userId : undefined;
    const groupId = typeof req.query.groupId === 'string' ? req.query.groupId : undefined;
    const where = {
      ...(req.user.role === 'LEADER' ? { leaderId: req.user.sub } : {}),
      ...(userId ? { userId } : {}),
      ...(groupId ? { groupId } : {}),
    };
    sendSuccess(
      res,
      await prisma.spiritualNote.findMany({
        where,
        include: {
          user: { select: USER_PUBLIC_SELECT },
          leader: { select: USER_PUBLIC_SELECT },
          group: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
    );
  }),
);
