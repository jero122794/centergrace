// apps/api/src/modules/worship/application/use-cases/WorshipUseCases.ts
import type { Prisma, Role } from '@prisma/client';
import { prisma, USER_PUBLIC_SELECT } from '../../../../shared/config/prisma';
import { AppError } from '../../../../shared/utils/app-error';
import { PushNotificationService } from '../../../notifications/infrastructure/PushNotificationService';
import { WORSHIP_DEFAULT_MIN_PROGRESS } from '../../../../shared/config/constants';

export class WorshipUseCases {
  constructor(private readonly push = new PushNotificationService()) {}

  async listSongs(query: string | undefined) {
    return prisma.song.findMany({
      where: query
        ? {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { artist: { contains: query, mode: 'insensitive' } },
              { originalKey: { contains: query, mode: 'insensitive' } },
              { tags: { has: query } },
            ],
          }
        : {},
      orderBy: { title: 'asc' },
    });
  }

  async createSong(
    actorId: string,
    input: {
      ministryId: string;
      title: string;
      artist?: string;
      originalKey: string;
      chords: Prisma.InputJsonValue;
      lyrics?: string;
      youtubeId?: string;
      tags: string[];
    },
  ) {
    return prisma.song.create({ data: { ...input, createdById: actorId } });
  }

  async createRehearsal(
    actorId: string,
    input: {
      ministryId: string;
      date: string;
      location?: string;
      notes?: string;
      songs: Array<{ songId: string; order: number; key: string }>;
    },
  ) {
    const rehearsal = await prisma.rehearsal.create({
      data: {
        ministryId: input.ministryId,
        date: new Date(input.date),
        location: input.location,
        notes: input.notes,
        createdById: actorId,
        songs: {
          create: input.songs.map((song) => ({
            songId: song.songId,
            order: song.order,
            key: song.key,
          })),
        },
      },
      include: { songs: true },
    });
    const members = await prisma.ministryMembership.findMany({
      where: { ministryId: input.ministryId, status: 'ACTIVE' },
    });
    await this.push.sendToUsers(
      members.map((item) => item.userId),
      { title: 'Nuevo ensayo', body: 'Se programó un ensayo de alabanza', url: `/ensayos/${rehearsal.id}` },
    );
    return rehearsal;
  }

  async apply(userId: string, ministryId: string, musicalRole?: Prisma.AuditionCreateInput['musicalRole']) {
    return prisma.audition.create({
      data: { userId, ministryId, musicalRole: musicalRole ?? null, status: 'PENDING' },
    });
  }

  async updateAudition(
    actor: { id: string; role: Role },
    auditionId: string,
    input: {
      status: Prisma.AuditionUpdateInput['status'];
      scheduledAt?: string;
      musicalRole?: Prisma.AuditionUpdateInput['musicalRole'];
      notes?: string;
    },
  ) {
    const audition = await prisma.audition.findUnique({ where: { id: auditionId } });
    if (!audition) {
      throw AppError.notFound('Audition not found');
    }
    if (input.status === 'ELIGIBLE') {
      const ready = await this.hasReachedSchoolThreshold(audition.userId, audition.ministryId);
      if (!ready) {
        throw AppError.unprocessable('School progress threshold has not been reached');
      }
    }
    const updated = await prisma.audition.update({
      where: { id: auditionId },
      data: {
        status: input.status,
        scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : undefined,
        musicalRole: input.musicalRole,
        notes: input.notes,
        evaluatedBy: actor.id,
      },
    });
    if (updated.status === 'APPROVED' && updated.musicalRole) {
      await prisma.$transaction([
        prisma.ministryMemberRole.upsert({
          where: { userId_ministryId: { userId: updated.userId, ministryId: updated.ministryId } },
          update: { musicalRole: updated.musicalRole },
          create: {
            userId: updated.userId,
            ministryId: updated.ministryId,
            musicalRole: updated.musicalRole,
          },
        }),
        prisma.auditLog.create({
          data: {
            userId: actor.id,
            action: 'AUDITION_APPROVED',
            entity: 'Audition',
            entityId: updated.id,
            metadata: { musicalRole: updated.musicalRole },
          },
        }),
      ]);
      await this.push.sendToUser(updated.userId, {
        title: 'Audición aprobada',
        body: 'Ahora formas parte del ministerio de alabanza',
      });
    }
    if (updated.status === 'SCHEDULED') {
      await this.push.sendToUser(updated.userId, {
        title: 'Audición agendada',
        body: 'Tu audición de alabanza ya tiene fecha',
      });
    }
    return updated;
  }

  async listRehearsals(ministryId?: string) {
    return prisma.rehearsal.findMany({
      where: ministryId ? { ministryId } : {},
      include: { songs: { include: { song: true }, orderBy: { order: 'asc' } }, attendance: true },
      orderBy: { date: 'desc' },
    });
  }

  async getRehearsal(id: string) {
    const rehearsal = await prisma.rehearsal.findUnique({
      where: { id },
      include: { songs: { include: { song: true }, orderBy: { order: 'asc' } }, attendance: true },
    });
    if (!rehearsal) {
      throw AppError.notFound('Rehearsal not found');
    }
    return rehearsal;
  }

  async addRehearsalSong(rehearsalId: string, input: { songId: string; order: number; key: string }) {
    await this.getRehearsal(rehearsalId);
    return prisma.rehearsalSong.create({
      data: { rehearsalId, songId: input.songId, order: input.order, key: input.key },
      include: { song: true },
    });
  }

  async updateRehearsalSong(
    rehearsalId: string,
    songId: string,
    input: { isReady?: boolean; key?: string; order?: number },
  ) {
    return prisma.rehearsalSong.update({
      where: { rehearsalId_songId: { rehearsalId, songId } },
      data: input,
      include: { song: true },
    });
  }

  private async hasReachedSchoolThreshold(userId: string, ministryId: string): Promise<boolean> {
    const config = await prisma.worshipSchoolConfig.findUnique({
      where: { ministryId },
      include: { requiredCourses: true },
    });
    const minProgress = config?.minProgress ?? WORSHIP_DEFAULT_MIN_PROGRESS;
    const courseIds = config?.requiredCourses.map((item) => item.courseId) ?? [];
    if (courseIds.length === 0) {
      return true;
    }
    const percents = await Promise.all(
      courseIds.map(async (courseId) => {
        const published = await prisma.lesson.count({ where: { courseId, status: 'PUBLISHED' } });
        const completed = await prisma.lessonProgress.count({
          where: { userId, completed: true, lesson: { courseId } },
        });
        return published === 0 ? 100 : Math.round((completed / published) * 100);
      }),
    );
    return percents.every((value) => value >= minProgress);
  }
}

export const worshipUserSelect = USER_PUBLIC_SELECT;
