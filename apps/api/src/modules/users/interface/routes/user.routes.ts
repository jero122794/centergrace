// apps/api/src/modules/users/interface/routes/user.routes.ts
import { Router } from 'express';
import { asyncHandler } from '../../../../shared/utils/async-handler';
import { authMiddleware } from '../../../../shared/middleware/auth.middleware';
import { requireRoles } from '../../../../shared/middleware/role.middleware';
import { validate } from '../../../../shared/middleware/validate.middleware';
import { audit } from '../../../../shared/middleware/audit.middleware';
import {
  changeRoleBodySchema,
  createStudentBodySchema,
  listUsersQuerySchema,
  updateUserBodySchema,
  userIdParamsSchema,
} from '../../application/dtos/user.dto';
import { PrismaUserDirectoryRepository } from '../../infrastructure/repositories/PrismaUserDirectoryRepository';
import { PrismaUserRepository } from '../../../auth/infrastructure/repositories/PrismaUserRepository';
import { SesEmailAdapter } from '../../../auth/infrastructure/adapters/SesEmailAdapter';
import { ListUsersUseCase } from '../../application/use-cases/ListUsersUseCase';
import { UpdateUserUseCase } from '../../application/use-cases/UpdateUserUseCase';
import { ChangeUserRoleUseCase } from '../../application/use-cases/ChangeUserRoleUseCase';
import { ToggleUserActiveUseCase } from '../../application/use-cases/ToggleUserActiveUseCase';
import { CreateStudentUseCase } from '../../application/use-cases/CreateStudentUseCase';
import { GetMemberFollowUpUseCase } from '../../application/use-cases/GetMemberFollowUpUseCase';
import { UserController } from '../controllers/UserController';
import { sendSuccess } from '../../../../shared/utils/http';
import { AppError } from '../../../../shared/utils/app-error';
import type { Response } from 'express';
import type { AuthenticatedRequest } from '../../../../shared/middleware/auth.middleware';

const followUp = new GetMemberFollowUpUseCase();

const directory = new PrismaUserDirectoryRepository();
const controller = new UserController(
  new ListUsersUseCase(directory),
  new UpdateUserUseCase(directory),
  new ChangeUserRoleUseCase(directory),
  new ToggleUserActiveUseCase(directory),
  new CreateStudentUseCase(new PrismaUserRepository(), new SesEmailAdapter()),
);

export const userRouter = Router();
userRouter.use(authMiddleware);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Listar usuarios
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema: { type: string, example: "STUDENT" }
 *       - in: query
 *         name: search
 *         schema: { type: string, example: "lider@iglesia.com" }
 *     responses:
 *       200:
 *         description: Lista paginada
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
userRouter.get(
  '/',
  requireRoles(['DEVELOPER', 'ADMIN', 'LEADER']),
  validate({ query: listUsersQuerySchema }),
  asyncHandler(controller.list),
);

/**
 * @swagger
 * /api/users/create-student:
 *   post:
 *     summary: Crear estudiante con contraseña temporal
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email]
 *             properties:
 *               name: { type: string, example: "Ana Pérez" }
 *               email: { type: string, example: "ana@iglesia.com" }
 *     responses:
 *       201:
 *         description: Estudiante creado
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
userRouter.post(
  '/create-student',
  requireRoles(['DEVELOPER', 'ADMIN', 'LEADER']),
  validate({ body: createStudentBodySchema }),
  audit({ action: 'USER_CREATE_STUDENT', entity: 'User', entityIdFrom: 'body', entityIdKey: 'email' }),
  asyncHandler(controller.createStudentHandler),
);

userRouter.get(
  '/:id/follow-up',
  requireRoles(['DEVELOPER', 'ADMIN', 'LEADER']),
  validate({ params: userIdParamsSchema }),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw AppError.unauthorized();
    }
    sendSuccess(res, await followUp.execute({ id: req.user.sub, role: req.user.role }, req.params.id));
  }),
);

userRouter.patch(
  '/:id',
  requireRoles(['DEVELOPER', 'ADMIN']),
  validate({ params: userIdParamsSchema, body: updateUserBodySchema }),
  asyncHandler(controller.update),
);

/**
 * @swagger
 * /api/users/{id}/role:
 *   patch:
 *     summary: Cambiar rol (nunca DEVELOPER)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Rol actualizado
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
userRouter.patch(
  '/:id/role',
  requireRoles(['DEVELOPER', 'ADMIN']),
  validate({ params: userIdParamsSchema, body: changeRoleBodySchema }),
  audit({ action: 'USER_CHANGE_ROLE', entity: 'User' }),
  asyncHandler(controller.role),
);

/**
 * @swagger
 * /api/users/{id}/toggle-active:
 *   patch:
 *     summary: Activar o desactivar usuario (nunca DEVELOPER)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estado actualizado
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
userRouter.patch(
  '/:id/toggle-active',
  requireRoles(['DEVELOPER', 'ADMIN']),
  validate({ params: userIdParamsSchema }),
  audit({ action: 'USER_TOGGLE_ACTIVE', entity: 'User' }),
  asyncHandler(controller.toggle),
);
