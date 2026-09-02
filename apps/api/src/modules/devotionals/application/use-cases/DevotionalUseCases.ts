// apps/api/src/modules/devotionals/application/use-cases/DevotionalUseCases.ts
import type { Prisma, Role } from '@prisma/client';
import { PARTICIPATION_EDIT_WINDOW_MS } from '../../../../shared/config/constants';
import { prisma } from '../../../../shared/config/prisma';
import { AppError } from '../../../../shared/utils/app-error';
import { PushNotificationService } from '../../../notifications/infrastructure/PushNotificationService';

export class DevotionalUseCases {
  constructor(private readonly push = new PushNotificationService()) {}

  async create(actorId: string, input: {
    title: string;
    content: unknown;
    verse?: string;
    mediaUrl?: string;
    mediaType?: string;
    date: string;
    scope?: 'GLOBAL' | 'GROUP';
    status?: 'DRAFT' | 'PUBLISHED';
    groupId?: string;
    questions: Array<{ text: string; order: number }>;
  }) {
    const date = new Date(`${input.date}T00:00:00.000Z`);
    if (input.status === 'PUBLISHED') {
      const existing = await prisma.devotional.findFirst({ where: { date, status: 'PUBLISHED' } });
      if (existing) {
        throw AppError.conflict('A published devotional already exists for this date');
      }
    }
    const created = await prisma.$transaction(async (tx) => {
      const devotional = await tx.devotional.create({
        data: {
          authorId: actorId,
          title: input.title,
          content: input.content as Prisma.InputJsonValue,
          verse: input.verse,
          mediaUrl: input.mediaUrl,
          mediaType: input.mediaType,
          date,
          scope: input.scope ?? 'GROUP',
          status: input.status ?? 'DRAFT',
        },
      });
      if (input.questions.length > 0) {
        await tx.devotionalQuestion.createMany({
          data: input.questions.map((question) => ({
            devotionalId: devotional.id,
            text: question.text,
            order: question.order,
          })),
        });
      }
      if (input.groupId) {
        await tx.groupDevotional.create({
          data: { groupId: input.groupId, devotionalId: devotional.id },
        });
      }
      return tx.devotional.findUniqueOrThrow({
        where: { id: devotional.id },
        include: { questions: { orderBy: { order: 'asc' } } },
      });
    });
    if (created.status === 'PUBLISHED') {
      await this.notifyPublished(created.id, created.title);
    }
    return created;
  }

  async today(userId: string) {
    const start = new Date();
    start.setUTCHours(0, 0, 0, 0);
    const memberships = await prisma.groupMembership.findMany({
      where: { userId, status: 'ACTIVE' },
      select: { groupId: true },
    });
    const groupIds = memberships.map((item) => item.groupId);
    return prisma.devotional.findFirst({
      where: {
        date: start,
        status: 'PUBLISHED',
        OR: [{ scope: 'GLOBAL' }, { groups: { some: { groupId: { in: groupIds } } } }],
      },
      include: {
        questions: { orderBy: { order: 'asc' } },
        participations: { where: { userId } },
      },
    });
  }

  async participate(userId: string, devotionalId: string, input: {
    content: string;
    answers: Array<{ questionId: string; answer: string }>;
  }) {
    const existing = await prisma.participation.findUnique({
      where: { devotionalId_userId: { devotionalId, userId } },
    });
    if (existing) {
      this.assertEditable(existing.createdAt);
      return this.updateParticipation(existing.id, input);
    }
    return prisma.participation.create({
      data: {
        devotionalId,
        userId,
        content: input.content,
        answers: { create: input.answers },
      },
      include: { answers: true },
    });
  }

  async history(userId: string) {
    return prisma.participation.findMany({
      where: { userId },
      include: { devotional: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  private assertEditable(createdAt: Date) {
    if (Date.now() - createdAt.getTime() > PARTICIPATION_EDIT_WINDOW_MS) {
      throw AppError.forbidden('Participation can only be edited within 24 hours');
    }
  }

  private updateParticipation(
    id: string,
    input: { content: string; answers: Array<{ questionId: string; answer: string }> },
  ) {
    return prisma.$transaction(async (tx) => {
      await tx.participationAnswer.deleteMany({ where: { participationId: id } });
      return tx.participation.update({
        where: { id },
        data: {
          content: input.content,
          answers: { create: input.answers },
        },
        include: { answers: true },
      });
    });
  }

  private async notifyPublished(devotionalId: string, title: string) {
    const links = await prisma.groupDevotional.findMany({ where: { devotionalId } });
    const members = await prisma.groupMembership.findMany({
      where: { groupId: { in: links.map((item) => item.groupId) }, status: 'ACTIVE' },
    });
    await this.push.sendToUsers(
      members.map((item) => item.userId),
      { title: 'Devocional del día', body: title, url: `/devocionales/${devotionalId}` },
    );
  }
}

export type ActorRole = Role;
