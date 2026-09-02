// apps/api/src/modules/courses/interface/routes/course.routes.ts
import { Router } from 'express';
import type { Response } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../../../../shared/utils/async-handler';
import { authMiddleware, type AuthenticatedRequest } from '../../../../shared/middleware/auth.middleware';
import { requireRoles } from '../../../../shared/middleware/role.middleware';
import { validate } from '../../../../shared/middleware/validate.middleware';
import { sendSuccess } from '../../../../shared/utils/http';
import { AppError } from '../../../../shared/utils/app-error';
import {
  courseIdParamsSchema,
  createCourseBodySchema,
  createLessonBodySchema,
  createModuleBodySchema,
  enrollBodySchema,
  lessonIdParamsSchema,
} from '../../application/dtos/course.dto';
import { CourseUseCases } from '../../application/use-cases/CourseUseCases';

const useCases = new CourseUseCases();
const actorOf = (req: AuthenticatedRequest) => {
  if (!req.user) {
    throw AppError.unauthorized();
  }
  return { id: req.user.sub, role: req.user.role };
};

export const courseRouter = Router();
export const lessonRouter = Router();
courseRouter.use(authMiddleware);
lessonRouter.use(authMiddleware);

/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Crear un nuevo curso
 *     description: Crea un curso con scope GROUP por defecto. Solo Admin y Leader pueden crear cursos.
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description]
 *             properties:
 *               title: { type: string, example: "Fundamentos de la Fe" }
 *               description: { type: string, example: "Curso introductorio para nuevos miembros" }
 *               scope: { type: string, example: "GROUP" }
 *     responses:
 *       201:
 *         description: Curso creado exitosamente
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
courseRouter.get(
  '/',
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    sendSuccess(res, await useCases.list(actorOf(req)));
  }),
);
courseRouter.post(
  '/',
  requireRoles(['DEVELOPER', 'ADMIN', 'LEADER']),
  validate({ body: createCourseBodySchema }),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    sendSuccess(res, await useCases.create(actorOf(req), req.body), 201);
  }),
);
courseRouter.get(
  '/:id',
  validate({ params: courseIdParamsSchema }),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    sendSuccess(res, await useCases.getById(actorOf(req), req.params.id));
  }),
);
courseRouter.get(
  '/:id/progress',
  validate({ params: courseIdParamsSchema }),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    sendSuccess(res, await useCases.progress(actorOf(req).id, req.params.id));
  }),
);
courseRouter.post(
  '/:id/modules',
  requireRoles(['DEVELOPER', 'ADMIN', 'LEADER']),
  validate({ params: courseIdParamsSchema, body: createModuleBodySchema }),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    sendSuccess(res, await useCases.addModule(req.params.id, req.body.title, req.body.order), 201);
  }),
);
courseRouter.post(
  '/:id/lessons',
  requireRoles(['DEVELOPER', 'ADMIN', 'LEADER']),
  validate({ params: courseIdParamsSchema, body: createLessonBodySchema }),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    sendSuccess(res, await useCases.addLesson(actorOf(req), req.params.id, req.body), 201);
  }),
);
courseRouter.post(
  '/:id/enroll',
  requireRoles(['DEVELOPER', 'ADMIN', 'LEADER']),
  validate({ params: courseIdParamsSchema, body: enrollBodySchema }),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    sendSuccess(res, await useCases.enroll(actorOf(req), req.params.id, req.body.userId), 201);
  }),
);
courseRouter.patch(
  '/:id/scope',
  requireRoles(['DEVELOPER', 'ADMIN']),
  validate({
    params: courseIdParamsSchema,
    body: z.object({ scope: z.enum(['GLOBAL', 'GROUP']) }),
  }),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    sendSuccess(res, await useCases.promoteScope(req.params.id, req.body.scope));
  }),
);

/**
 * @swagger
 * /api/lessons/{id}/complete:
 *   post:
 *     summary: Marcar lección como completada
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Progreso actualizado
 */
lessonRouter.post(
  '/:id/complete',
  validate({ params: lessonIdParamsSchema }),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    sendSuccess(res, await useCases.completeLesson(actorOf(req).id, req.params.id));
  }),
);
