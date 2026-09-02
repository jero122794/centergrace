// apps/api/src/modules/ministries/interface/routes/ministry.routes.ts
import { Router } from 'express';
import { asyncHandler } from '../../../../shared/utils/async-handler';
import { authMiddleware } from '../../../../shared/middleware/auth.middleware';
import { requireRoles } from '../../../../shared/middleware/role.middleware';
import { validate } from '../../../../shared/middleware/validate.middleware';
import {
  createMinistryBodySchema,
  ministryIdParamsSchema,
  updateMinistryBodySchema,
} from '../../application/dtos/ministry.dto';
import { MinistryUseCases } from '../../application/use-cases/MinistryUseCases';
import { MinistryController } from '../controllers/MinistryController';

const controller = new MinistryController(new MinistryUseCases());
export const ministryRouter = Router();
ministryRouter.use(authMiddleware);

/**
 * @swagger
 * /api/ministries:
 *   get:
 *     summary: Listar ministerios
 *     tags: [Ministries]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ministerios
 *   post:
 *     summary: Crear ministerio
 *     tags: [Ministries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, type, leaderId]
 *             properties:
 *               name: { type: string, example: "Ministerio de Alabanza" }
 *               type: { type: string, example: "MINISTRY" }
 *               leaderId: { type: string, example: "clxleader001" }
 *     responses:
 *       201:
 *         description: Ministerio creado
 */
ministryRouter.get('/', requireRoles(['DEVELOPER', 'ADMIN', 'LEADER']), asyncHandler(controller.list));
ministryRouter.post(
  '/',
  requireRoles(['DEVELOPER', 'ADMIN']),
  validate({ body: createMinistryBodySchema }),
  asyncHandler(controller.create),
);
ministryRouter.get(
  '/:id',
  requireRoles(['DEVELOPER', 'ADMIN', 'LEADER']),
  validate({ params: ministryIdParamsSchema }),
  asyncHandler(controller.get),
);
ministryRouter.patch(
  '/:id',
  requireRoles(['DEVELOPER', 'ADMIN']),
  validate({ params: ministryIdParamsSchema, body: updateMinistryBodySchema }),
  asyncHandler(controller.update),
);
ministryRouter.get(
  '/:id/members',
  requireRoles(['DEVELOPER', 'ADMIN', 'LEADER']),
  validate({ params: ministryIdParamsSchema }),
  asyncHandler(controller.members),
);
ministryRouter.get(
  '/:id/stats',
  requireRoles(['DEVELOPER', 'ADMIN']),
  validate({ params: ministryIdParamsSchema }),
  asyncHandler(controller.stats),
);
