// apps/api/src/modules/users/application/use-cases/GetMemberFollowUpUseCase.ts
import type { Role } from '@prisma/client';
import { prisma, USER_PUBLIC_SELECT } from '../../../../shared/config/prisma';
import { AppError } from '../../../../shared/utils/app-error';

/**
 * Returns a member profile with spiritual notes and recent ministry activity.
 */
export class GetMemberFollowUpUseCase {
  async execute(actor: { id: string; role: Role }, userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: USER_PUBLIC_SELECT,
    });
    if (!user) {
      throw AppError.notFound('User not found');
    }
    if (actor.role === 'LEADER') {
      const shared = await prisma.groupMembership.findFirst({
        where: { userId, group: { leaderId: actor.id } },
      });
      if (!shared) {
        throw AppError.forbidden();
      }
    }
    const [memberships, notes, submissions, participations, enrollments] = await Promise.all([
      prisma.groupMembership.findMany({
        where: { userId },
        include: { group: { select: { id: true, name: true, type: true } } },
      }),
      prisma.spiritualNote.findMany({
        where: actor.role === 'LEADER' ? { userId, leaderId: actor.id } : { userId },
        include: {
          leader: { select: USER_PUBLIC_SELECT },
          group: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.submission.findMany({
        where: { userId },
        include: { lesson: { select: { id: true, title: true, courseId: true } }, grade: true },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      prisma.participation.findMany({
        where: { userId },
        include: { devotional: { select: { id: true, title: true, date: true } } },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      prisma.enrollment.findMany({
        where: { userId },
        include: { course: { select: { id: true, title: true } } },
      }),
    ]);
    return { user, memberships, notes, submissions, participations, enrollments };
  }
}
