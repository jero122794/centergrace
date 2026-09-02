// apps/api/src/jobs/rehearsal-reminder.job.ts
import { prisma } from '../shared/config/prisma';
import { PushNotificationService } from '../modules/notifications/infrastructure/PushNotificationService';

/**
 * 20:00 — remind ministry members if there is a rehearsal tomorrow.
 */
export const runRehearsalReminderJob = async (): Promise<{ notified: number }> => {
  const from = new Date();
  from.setUTCDate(from.getUTCDate() + 1);
  from.setUTCHours(0, 0, 0, 0);
  const to = new Date(from);
  to.setUTCDate(to.getUTCDate() + 1);
  const rehearsals = await prisma.rehearsal.findMany({
    where: { date: { gte: from, lt: to } },
  });
  const push = new PushNotificationService();
  let notified = 0;
  for (const rehearsal of rehearsals) {
    const members = await prisma.ministryMembership.findMany({
      where: { ministryId: rehearsal.ministryId, status: 'ACTIVE' },
    });
    await push.sendToUsers(
      members.map((item) => item.userId),
      { title: 'Ensayo mañana', body: rehearsal.location ?? 'Ministerio de Alabanza' },
    );
    notified += members.length;
  }
  return { notified };
};
