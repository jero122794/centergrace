// apps/api/src/modules/auth/interface/routes/auth.routes.ts
import { Router } from 'express';
import { asyncHandler } from '../../../../shared/utils/async-handler';
import { authLimiter } from '../../../../shared/middleware/rate-limit.middleware';
import { validate } from '../../../../shared/middleware/validate.middleware';
import { authMiddleware } from '../../../../shared/middleware/auth.middleware';
import {
  changePasswordBodySchema,
  loginBodySchema,
  registerBodySchema,
} from '../../application/dtos/auth.dto';
import { PrismaUserRepository } from '../../infrastructure/repositories/PrismaUserRepository';
import { PrismaRefreshTokenRepository } from '../../infrastructure/repositories/PrismaRefreshTokenRepository';
import { JwtAdapter } from '../../infrastructure/adapters/JwtAdapter';
import { SesEmailAdapter } from '../../infrastructure/adapters/SesEmailAdapter';
import { GoogleOAuthAdapter } from '../../infrastructure/adapters/GoogleOAuthAdapter';
import { RegisterUserUseCase } from '../../application/use-cases/RegisterUserUseCase';
import { LoginUserUseCase } from '../../application/use-cases/LoginUserUseCase';
import { RefreshSessionUseCase } from '../../application/use-cases/RefreshSessionUseCase';
import { LogoutUserUseCase } from '../../application/use-cases/LogoutUserUseCase';
import { ChangePasswordUseCase } from '../../application/use-cases/ChangePasswordUseCase';
import { GetCurrentUserUseCase } from '../../application/use-cases/GetCurrentUserUseCase';
import { GoogleOAuthUseCase } from '../../application/use-cases/GoogleOAuthUseCase';
import { AuthController } from '../controllers/AuthController';

const users = new PrismaUserRepository();
const refreshTokens = new PrismaRefreshTokenRepository();
const jwtAdapter = new JwtAdapter();
const emailAdapter = new SesEmailAdapter();
const googleAdapter = new GoogleOAuthAdapter();

const controller = new AuthController(
  new RegisterUserUseCase(users, refreshTokens, jwtAdapter, emailAdapter),
  new LoginUserUseCase(users, refreshTokens, jwtAdapter),
  new RefreshSessionUseCase(users, refreshTokens, jwtAdapter),
  new LogoutUserUseCase(refreshTokens),
  new ChangePasswordUseCase(users),
  new GetCurrentUserUseCase(users),
  new GoogleOAuthUseCase(users, refreshTokens, jwtAdapter, googleAdapter),
);

export const authRouter = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar un estudiante
 *     description: Crea una cuenta STUDENT y envía el correo de bienvenida.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string, example: "María López" }
 *               email: { type: string, example: "maria@iglesia.com" }
 *               password: { type: string, example: "Estudiante123!" }
 *     responses:
 *       201:
 *         description: Cuenta creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       409:
 *         description: Email ya registrado
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
authRouter.post(
  '/register',
  authLimiter,
  validate({ body: registerBodySchema }),
  asyncHandler(controller.register),
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     description: Devuelve accessToken y deja el refresh token en cookie HttpOnly.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: "lider@iglesia.com" }
 *               password: { type: string, example: "Lider123!" }
 *     responses:
 *       200:
 *         description: Sesión iniciada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
authRouter.post('/login', authLimiter, validate({ body: loginBodySchema }), asyncHandler(controller.login));

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Rotar refresh token
 *     description: Invalida el refresh token actual y emite uno nuevo.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Token renovado
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
authRouter.post('/refresh', authLimiter, asyncHandler(controller.refresh));

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Cerrar sesión
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Sesión cerrada
 */
authRouter.post('/logout', asyncHandler(controller.logout));

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Usuario autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil actual
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
authRouter.get('/me', authMiddleware, asyncHandler(controller.me));

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Cambiar contraseña
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword: { type: string, example: "Lider123!" }
 *               newPassword: { type: string, example: "NuevaClave123!" }
 *     responses:
 *       200:
 *         description: Contraseña actualizada
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
authRouter.post(
  '/change-password',
  authMiddleware,
  validate({ body: changePasswordBodySchema }),
  asyncHandler(controller.changePasswordHandler),
);

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Iniciar OAuth2 Google
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirección a Google
 */
authRouter.get('/google', asyncHandler(controller.googleStart));

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Callback OAuth2 Google
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: code
 *         schema: { type: string }
 *     responses:
 *       302:
 *         description: Redirección al frontend con accessToken
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
authRouter.get('/google/callback', asyncHandler(controller.googleCallback));
