// apps/api/src/modules/notifications/infrastructure/PushNotificationService.ts
import webpush from 'web-push';
import { prisma } from '../../../shared/config/prisma';
import { env } from '../../../shared/config/env';
import { logger } from '../../../shared/utils/logger';

let vapidConfigured = false;

const configureVapid = (): void => {
  if (vapidConfigured || !env.VAPID_PUBLIC_KEY || !env.VAPID_PRIVATE_KEY) {
    return;
  }
  webpush.setVapidDetails(env.VAPID_SUBJECT, env.VAPID_PUBLIC_KEY, env.VAPID_PRIVATE_KEY);
  vapidConfigured = true;
};

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
}

/**
 * Sends Web Push notifications to stored subscriptions.
 */
export class PushNotificationService {
  async subscribe(userId: string, input: { endpoint: string; keys: { p256dh: string; auth: string } }) {
    return prisma.pushSubscription.upsert({
      where: { endpoint: input.endpoint },
      update: { userId, p256dh: input.keys.p256dh, auth: input.keys.auth },
      create: {
        userId,
        endpoint: input.endpoint,
        p256dh: input.keys.p256dh,
        auth: input.keys.auth,
      },
    });
  }

  async sendToUser(userId: string, payload: PushPayload): Promise<void> {
    if (env.NODE_ENV === 'test') {
      return;
    }
    configureVapid();
    const subscriptions = await prisma.pushSubscription.findMany({ where: { userId } });
    await Promise.all(subscriptions.map((item) => this.sendOne(item, payload)));
  }

  async sendToUsers(userIds: string[], payload: PushPayload): Promise<void> {
    const unique = [...new Set(userIds)];
    await Promise.all(unique.map((id) => this.sendToUser(id, payload)));
  }

  private async sendOne(
    item: { id: string; endpoint: string; p256dh: string; auth: string },
    payload: PushPayload,
  ): Promise<void> {
    try {
      await webpush.sendNotification(
        { endpoint: item.endpoint, keys: { p256dh: item.p256dh, auth: item.auth } },
        JSON.stringify(payload),
      );
    } catch (error) {
      logger.warn('Web push delivery failed', {
        context: 'web-push',
        message: error instanceof Error ? error.message : 'unknown',
      });
    }
  }
}
