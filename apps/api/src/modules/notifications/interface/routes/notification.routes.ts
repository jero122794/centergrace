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

const unsubscribeSchema = z.object({
  endpoint: z.string().url(),
});

const notificationIdParams = z.object({ id: z.string().min(1) });

const push = new PushNotificationService();
export const notificationRouter = Router();
notificationRouter.use(authMiddleware);

const userId = (req: AuthenticatedRequest): string => {
  if (!req.user) {
    throw AppError.unauthorized();
  }
  return req.user.sub;
};

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Listar notificaciones in-app del usuario
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 */
notificationRouter.get(
  '/',
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    sendSuccess(res, await push.listForUser(userId(req)));
  }),
);
notificationRouter.get(
  '/unread-count',
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    sendSuccess(res, { count: await push.unreadCount(userId(req)) });
  }),
);
notificationRouter.get(
  '/push-status',
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    sendSuccess(res, await push.pushStatus(userId(req)));
  }),
);
notificationRouter.post(
  '/subscribe',
  validate({ body: subscribeSchema }),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    sendSuccess(res, await push.subscribe(userId(req), req.body), 201);
  }),
);
notificationRouter.delete(
  '/subscribe',
  validate({ body: unsubscribeSchema }),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    await push.unsubscribe(userId(req), req.body.endpoint);
    sendSuccess(res, { ok: true });
  }),
);
notificationRouter.patch(
  '/read-all',
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    sendSuccess(res, { updated: await push.markAllRead(userId(req)) });
  }),
);
notificationRouter.patch(
  '/:id/read',
  validate({ params: notificationIdParams }),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const updated = await push.markRead(userId(req), req.params.id);
    if (!updated) {
      throw AppError.notFound('Notification not found');
    }
    sendSuccess(res, updated);
  }),
);
