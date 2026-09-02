// apps/api/src/modules/submissions/application/use-cases/SubmissionUseCases.ts
import type { Role } from '@prisma/client';
import { GRADE_MAX_SCORE, GRADE_MIN_SCORE } from '../../../../shared/config/constants';
import { prisma, USER_PUBLIC_SELECT } from '../../../../shared/config/prisma';
import { AppError } from '../../../../shared/utils/app-error';
import { PushNotificationService } from '../../../notifications/infrastructure/PushNotificationService';

export class SubmissionUseCases {
  constructor(private readonly push = new PushNotificationService()) {}

  async submit(userId: string, input: { lessonId: string; content: string; fileUrl?: string }) {
    const lesson = await prisma.lesson.findUnique({ where: { id: input.lessonId } });
    if (!lesson?.hasAssignment) {
      throw AppError.unprocessable('This lesson does not accept submissions');
    }
    return prisma.submission.upsert({
      where: { lessonId_userId: { lessonId: input.lessonId, userId } },
      update: { content: input.content, fileUrl: input.fileUrl, status: 'PENDING' },
      create: { lessonId: input.lessonId, userId, content: input.content, fileUrl: input.fileUrl },
    });
  }

  async listForGrading(actor: { id: string; role: Role }) {
    const where =
      actor.role === 'LEADER'
        ? { lesson: { course: { createdById: actor.id } } }
        : {};
    return prisma.submission.findMany({
      where,
      include: {
        user: { select: USER_PUBLIC_SELECT },
        lesson: true,
        grade: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async grade(
    actor: { id: string; role: Role },
    submissionId: string,
    input: { score: number; feedback?: string },
  ) {
    if (input.score < GRADE_MIN_SCORE || input.score > GRADE_MAX_SCORE) {
      throw AppError.unprocessable('Score must be between 0 and 100');
    }
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: { lesson: { include: { course: true } } },
    });
    if (!submission) {
      throw AppError.notFound('Submission not found');
    }
    if (actor.role === 'LEADER' && submission.lesson.course.createdById !== actor.id) {
      throw AppError.forbidden();
    }
    const graded = await prisma.$transaction(async (tx) => {
      const grade = await tx.grade.upsert({
        where: { submissionId },
        update: { score: input.score, feedback: input.feedback, gradedById: actor.id, gradedAt: new Date() },
        create: {
          submissionId,
          gradedById: actor.id,
          score: input.score,
          feedback: input.feedback,
        },
      });
      await tx.submission.update({ where: { id: submissionId }, data: { status: 'GRADED' } });
      await tx.auditLog.create({
        data: {
          userId: actor.id,
          action: 'GRADE_UPSERT',
          entity: 'Grade',
          entityId: grade.id,
          metadata: { score: input.score, submissionId },
        },
      });
      return grade;
    });
    await this.push.sendToUser(submission.userId, {
      title: 'Calificación recibida',
      body: `Tu trabajo recibió ${input.score}/100`,
      url: '/mis-trabajos',
    });
    return graded;
  }
}
