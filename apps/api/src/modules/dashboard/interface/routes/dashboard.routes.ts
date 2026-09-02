// apps/api/src/modules/dashboard/interface/routes/dashboard.routes.ts
import { Router } from 'express';
import type { Response } from 'express';
import { asyncHandler } from '../../../../shared/utils/async-handler';
import { authMiddleware, type AuthenticatedRequest } from '../../../../shared/middleware/auth.middleware';
import { sendSuccess } from '../../../../shared/utils/http';
import { AppError } from '../../../../shared/utils/app-error';
import { prisma } from '../../../../shared/config/prisma';

export const dashboardRouter = Router();
dashboardRouter.use(authMiddleware);

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Métricas del dashboard por rol
 *     tags: [Health]
 *     security:
 *       - bearerAuth: []
 */
dashboardRouter.get(
  '/',
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw AppError.unauthorized();
    }
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    if (req.user.role === 'STUDENT') {
      const [enrollments, lastGrade, participations] = await prisma.$transaction([
        prisma.enrollment.count({ where: { userId: req.user.sub } }),
        prisma.grade.findFirst({
          where: { submission: { userId: req.user.sub } },
          orderBy: { gradedAt: 'desc' },
        }),
        prisma.participation.findMany({
          where: { userId: req.user.sub },
          orderBy: { createdAt: 'desc' },
          take: 30,
        }),
      ]);
      sendSuccess(res, {
        enrollments,
        lastGrade,
        streak: computeStreak(participations.map((item) => item.createdAt)),
      });
      return;
    }
    const [users, ministries, groups, courses, devotionals, participationsToday] = await prisma.$transaction([
      prisma.user.count(),
      prisma.ministry.count(),
      prisma.group.count(),
      prisma.course.count({ where: { isActive: true } }),
      prisma.devotional.count({
        where: {
          createdAt: { gte: new Date(today.getFullYear(), today.getMonth(), 1) },
        },
      }),
      prisma.participation.count({ where: { createdAt: { gte: today } } }),
    ]);
    sendSuccess(res, { users, ministries, groups, courses, devotionals, participationsToday });
  }),
);

const computeStreak = (dates: Date[]): number => {
  const days = new Set(dates.map((date) => date.toISOString().slice(0, 10)));
  let streak = 0;
  const cursor = new Date();
  while (days.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
};
