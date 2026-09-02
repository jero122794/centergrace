// apps/api/src/jobs/participation-reminder.job.ts
import { prisma } from '../shared/config/prisma';
import { PushNotificationService } from '../modules/notifications/infrastructure/PushNotificationService';

/**
 * 18:00 — remind students who have not participated in today's devotional.
 */
export const runParticipationReminderJob = async (): Promise<{ notified: number }> => {
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  const today = await prisma.devotional.findFirst({
    where: { date: start, status: 'PUBLISHED' },
    include: { groups: true, participations: true },
  });
  if (!today) {
    return { notified: 0 };
  }
  const participated = new Set(today.participations.map((item) => item.userId));
  const members = await prisma.groupMembership.findMany({
    where: { groupId: { in: today.groups.map((item) => item.groupId) }, status: 'ACTIVE' },
  });
  const pending = members.map((item) => item.userId).filter((id) => !participated.has(id));
  await new PushNotificationService().sendToUsers(pending, {
    title: 'Participa hoy',
    body: today.title,
    url: `/devocionales/${today.id}`,
  });
  return { notified: pending.length };
};
