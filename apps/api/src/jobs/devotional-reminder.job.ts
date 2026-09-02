// apps/api/src/jobs/devotional-reminder.job.ts
import { prisma } from '../shared/config/prisma';
import { PushNotificationService } from '../modules/notifications/infrastructure/PushNotificationService';

/**
 * 07:00 — notify students whose group has a published devotional today.
 */
export const runDevotionalReminderJob = async (): Promise<{ notified: number }> => {
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  const devotionals = await prisma.devotional.findMany({
    where: { date: start, status: 'PUBLISHED' },
    include: { groups: true },
  });
  const push = new PushNotificationService();
  let notified = 0;
  for (const item of devotionals) {
    const members = await prisma.groupMembership.findMany({
      where: { groupId: { in: item.groups.map((group) => group.groupId) }, status: 'ACTIVE' },
    });
    await push.sendToUsers(
      members.map((member) => member.userId),
      { title: 'Devocional del día', body: item.title, url: `/devocionales/${item.id}` },
    );
    notified += members.length;
  }
  return { notified };
};
