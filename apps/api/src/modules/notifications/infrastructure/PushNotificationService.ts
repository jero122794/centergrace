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
 * Persists in-app notifications and delivers Web Push when subscriptions exist.
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

  async unsubscribe(userId: string, endpoint: string): Promise<void> {
    await prisma.pushSubscription.deleteMany({ where: { userId, endpoint } });
  }

  async listForUser(userId: string) {
    return prisma.inAppNotification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async unreadCount(userId: string): Promise<number> {
    return prisma.inAppNotification.count({ where: { userId, readAt: null } });
  }

  async markRead(userId: string, id: string) {
    const existing = await prisma.inAppNotification.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      return null;
    }
    return prisma.inAppNotification.update({
      where: { id },
      data: { readAt: existing.readAt ?? new Date() },
    });
  }

  async markAllRead(userId: string): Promise<number> {
    const result = await prisma.inAppNotification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() },
    });
    return result.count;
  }

  async pushStatus(userId: string) {
    const count = await prisma.pushSubscription.count({ where: { userId } });
    return { subscribed: count > 0, subscriptionCount: count };
  }

  async sendToUser(userId: string, payload: PushPayload): Promise<void> {
    await this.persist([userId], payload);
    await this.pushToUser(userId, payload);
  }

  async sendToUsers(userIds: string[], payload: PushPayload): Promise<void> {
    const unique = [...new Set(userIds)];
    await this.persist(unique, payload);
    await Promise.all(unique.map((id) => this.pushToUser(id, payload)));
  }

  private async persist(userIds: string[], payload: PushPayload): Promise<void> {
    if (userIds.length === 0) {
      return;
    }
    await prisma.inAppNotification.createMany({
      data: userIds.map((userId) => ({
        userId,
        title: payload.title,
        body: payload.body,
        url: payload.url,
      })),
    });
  }

  private async pushToUser(userId: string, payload: PushPayload): Promise<void> {
    if (env.NODE_ENV === 'test') {
      return;
    }
    configureVapid();
    const subscriptions = await prisma.pushSubscription.findMany({ where: { userId } });
    await Promise.all(subscriptions.map((item) => this.sendOne(item, payload)));
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
      const status = (error as { statusCode?: number }).statusCode;
      if (status === 404 || status === 410) {
        await prisma.pushSubscription.delete({ where: { id: item.id } }).catch(() => undefined);
      }
    }
  }
}
