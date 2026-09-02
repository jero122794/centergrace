// apps/api/src/modules/groups/interface/routes/group.routes.ts
import { Router } from 'express';
import type { Response } from 'express';
import { asyncHandler } from '../../../../shared/utils/async-handler';
import { authMiddleware, type AuthenticatedRequest } from '../../../../shared/middleware/auth.middleware';
import { requireRoles } from '../../../../shared/middleware/role.middleware';
import { validate } from '../../../../shared/middleware/validate.middleware';
import { sendSuccess } from '../../../../shared/utils/http';
import { AppError } from '../../../../shared/utils/app-error';
import {
  addMemberBodySchema,
  createGroupBodySchema,
  groupIdParamsSchema,
  groupMemberParamsSchema,
} from '../../application/dtos/group.dto';
import { GroupUseCases } from '../../application/use-cases/GroupUseCases';

const useCases = new GroupUseCases();
const actorOf = (req: AuthenticatedRequest) => {
  if (!req.user) {
    throw AppError.unauthorized();
  }
  return { id: req.user.sub, role: req.user.role };
};

export const groupRouter = Router();
groupRouter.use(authMiddleware);
groupRouter.use(requireRoles(['DEVELOPER', 'ADMIN', 'LEADER']));

/**
 * @swagger
 * /api/groups:
 *   get:
 *     summary: Listar grupos
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Grupos visibles para el actor
 *   post:
 *     summary: Crear grupo
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, type]
 *             properties:
 *               name: { type: string, example: "Célula Norte" }
 *               type: { type: string, example: "CELL" }
 *     responses:
 *       201:
 *         description: Grupo creado
 */
groupRouter.get(
  '/',
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    sendSuccess(res, await useCases.list(actorOf(req)));
  }),
);
groupRouter.post(
  '/',
  validate({ body: createGroupBodySchema }),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    sendSuccess(res, await useCases.create(actorOf(req), req.body), 201);
  }),
);
groupRouter.get(
  '/:id',
  validate({ params: groupIdParamsSchema }),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    sendSuccess(res, await useCases.getById(actorOf(req), req.params.id));
  }),
);
groupRouter.get(
  '/:id/members',
  validate({ params: groupIdParamsSchema }),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    sendSuccess(res, await useCases.members(actorOf(req), req.params.id));
  }),
);
groupRouter.post(
  '/:id/members',
  validate({ params: groupIdParamsSchema, body: addMemberBodySchema }),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    sendSuccess(res, await useCases.addMember(actorOf(req), req.params.id, req.body.userId), 201);
  }),
);
groupRouter.delete(
  '/:id/members/:userId',
  validate({ params: groupMemberParamsSchema }),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    await useCases.removeMember(actorOf(req), req.params.id, req.params.userId);
    sendSuccess(res, { ok: true });
  }),
);
