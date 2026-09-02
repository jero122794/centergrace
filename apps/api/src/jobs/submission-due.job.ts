// apps/api/src/jobs/submission-due.job.ts
import { prisma } from '../shared/config/prisma';
import { PushNotificationService } from '../modules/notifications/infrastructure/PushNotificationService';

/**
 * 08:00 — reminder for pending assignments (students enrolled, no submission).
 */
export const runSubmissionDueJob = async (): Promise<{ notified: number }> => {
  const lessons = await prisma.lesson.findMany({
    where: { hasAssignment: true, status: 'PUBLISHED' },
    include: { course: { include: { enrollments: true } }, submissions: true },
  });
  const push = new PushNotificationService();
  const pendingUserIds = new Set<string>();
  for (const lesson of lessons) {
    const submitted = new Set(lesson.submissions.map((item) => item.userId));
    for (const enrollment of lesson.course.enrollments) {
      if (!submitted.has(enrollment.userId)) {
        pendingUserIds.add(enrollment.userId);
      }
    }
  }
  await push.sendToUsers([...pendingUserIds], {
    title: 'Entrega pendiente',
    body: 'Tienes trabajos por entregar en las próximas 48 horas',
    url: '/mis-trabajos',
  });
  return { notified: pendingUserIds.size };
};
