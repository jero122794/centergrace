// apps/api/src/modules/settings/interface/routes/setting.routes.ts
import { Router } from 'express';
import type { Response } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../../../../shared/utils/async-handler';
import { authMiddleware, type AuthenticatedRequest } from '../../../../shared/middleware/auth.middleware';
import { requireRoles } from '../../../../shared/middleware/role.middleware';
import { validate } from '../../../../shared/middleware/validate.middleware';
import { sendSuccess } from '../../../../shared/utils/http';
import { AppError } from '../../../../shared/utils/app-error';
import { prisma } from '../../../../shared/config/prisma';
import {
  DEFAULT_ACCENT_COLOR,
  DEFAULT_CHURCH_NAME,
  DEFAULT_PRIMARY_COLOR,
} from '../../../../shared/config/constants';

const updateSettingsBodySchema = z.object({
  churchName: z.string().min(2).max(180).optional(),
  logoUrl: z.string().min(1).max(2000).nullable().optional(),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
});

export const settingRouter = Router();
settingRouter.use(authMiddleware);

const ensureSingleton = async () => {
  const existing = await prisma.churchSetting.findUnique({ where: { id: 'singleton' } });
  if (existing) {
    return existing;
  }
  return prisma.churchSetting.create({
    data: {
      id: 'singleton',
      churchName: DEFAULT_CHURCH_NAME,
      primaryColor: DEFAULT_PRIMARY_COLOR,
      accentColor: DEFAULT_ACCENT_COLOR,
    },
  });
};

/**
 * @swagger
 * /api/settings:
 *   get:
 *     summary: Obtener identidad visual de la iglesia
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Configuración actual
 *   patch:
 *     summary: Actualizar nombre, logo y colores
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 */
settingRouter.get(
  '/',
  asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
    sendSuccess(res, await ensureSingleton());
  }),
);

settingRouter.patch(
  '/',
  requireRoles(['DEVELOPER', 'ADMIN']),
  validate({ body: updateSettingsBodySchema }),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw AppError.unauthorized();
    }
    await ensureSingleton();
    const updated = await prisma.churchSetting.update({
      where: { id: 'singleton' },
      data: req.body,
    });
    sendSuccess(res, updated);
  }),
);
