// apps/api/src/modules/submissions/interface/routes/submission.routes.ts
import { Router } from 'express';
import type { Response } from 'express';
import { asyncHandler } from '../../../../shared/utils/async-handler';
import { authMiddleware, type AuthenticatedRequest } from '../../../../shared/middleware/auth.middleware';
import { requireRoles } from '../../../../shared/middleware/role.middleware';
import { validate } from '../../../../shared/middleware/validate.middleware';
import { sendSuccess } from '../../../../shared/utils/http';
import { AppError } from '../../../../shared/utils/app-error';
import {
  createSubmissionBodySchema,
  gradeBodySchema,
  submissionIdParamsSchema,
} from '../../application/dtos/submission.dto';
import { SubmissionUseCases } from '../../application/use-cases/SubmissionUseCases';
import { prisma } from '../../../../shared/config/prisma';

const useCases = new SubmissionUseCases();
export const submissionRouter = Router();
export const gradeRouter = Router();
submissionRouter.use(authMiddleware);
gradeRouter.use(authMiddleware);

/**
 * @swagger
 * /api/submissions:
 *   post:
 *     summary: Entregar trabajo
 *     tags: [Submissions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Entrega registrada
 */
submissionRouter.post(
  '/',
  validate({ body: createSubmissionBodySchema }),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw AppError.unauthorized();
    }
    sendSuccess(res, await useCases.submit(req.user.sub, req.body), 201);
  }),
);
submissionRouter.get(
  '/',
  requireRoles(['DEVELOPER', 'ADMIN', 'LEADER']),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw AppError.unauthorized();
    }
    sendSuccess(res, await useCases.listForGrading({ id: req.user.sub, role: req.user.role }));
  }),
);
submissionRouter.get(
  '/mine',
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw AppError.unauthorized();
    }
    sendSuccess(
      res,
      await prisma.submission.findMany({
        where: { userId: req.user.sub },
        include: { grade: true, lesson: true },
        orderBy: { createdAt: 'desc' },
      }),
    );
  }),
);

/**
 * @swagger
 * /api/grades/{id}:
 *   put:
 *     summary: Calificar o actualizar una entrega
 *     tags: [Grades]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Calificación guardada
 */
gradeRouter.put(
  '/:id',
  requireRoles(['DEVELOPER', 'ADMIN', 'LEADER']),
  validate({ params: submissionIdParamsSchema, body: gradeBodySchema }),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw AppError.unauthorized();
    }
    sendSuccess(
      res,
      await useCases.grade({ id: req.user.sub, role: req.user.role }, req.params.id, req.body),
    );
  }),
);
