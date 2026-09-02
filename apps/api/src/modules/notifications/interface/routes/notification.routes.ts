// apps/api/src/modules/notifications/interface/routes/notification.routes.ts
import { Router } from 'express';
import type { Response } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../../../../shared/utils/async-handler';
import { authMiddleware, type AuthenticatedRequest } from '../../../../shared/middleware/auth.middleware';
import { validate } from '../../../../shared/middleware/validate.middleware';
import { sendSuccess } from '../../../../shared/utils/http';
import { AppError } from '../../../../shared/utils/app-error';
import { PushNotificationService } from '../../infrastructure/PushNotificationService';

const subscribeSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string().min(1),
    auth: z.string().min(1),
  }),
});

const push = new PushNotificationService();
export const notificationRouter = Router();
notificationRouter.use(authMiddleware);

/**
 * @swagger
 * /api/notifications/subscribe:
 *   post:
 *     summary: Guardar suscripción Web Push
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Suscripción almacenada
 */
notificationRouter.post(
  '/subscribe',
  validate({ body: subscribeSchema }),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw AppError.unauthorized();
    }
    sendSuccess(res, await push.subscribe(req.user.sub, req.body), 201);
  }),
);
