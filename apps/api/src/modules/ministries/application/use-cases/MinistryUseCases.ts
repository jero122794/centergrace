// apps/api/src/modules/ministries/application/use-cases/MinistryUseCases.ts
import { prisma, USER_PUBLIC_SELECT } from '../../../../shared/config/prisma';
import { AppError } from '../../../../shared/utils/app-error';
import type { GroupType } from '@prisma/client';

interface MinistryInput {
  name: string;
  description?: string;
  type: GroupType;
  coverImage?: string;
  leaderId: string;
}

export class MinistryUseCases {
  async list() {
    return prisma.ministry.findMany({
      include: { leader: { select: USER_PUBLIC_SELECT } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(id: string) {
    const ministry = await prisma.ministry.findUnique({
      where: { id },
      include: { leader: { select: USER_PUBLIC_SELECT }, groups: true },
    });
    if (!ministry) {
      throw AppError.notFound('Ministry not found');
    }
    return ministry;
  }

  async create(actorId: string, input: MinistryInput) {
    await this.assertLeader(input.leaderId);
    return prisma.ministry.create({
      data: { ...input, createdById: actorId },
      include: { leader: { select: USER_PUBLIC_SELECT } },
    });
  }

  async update(id: string, input: Partial<MinistryInput>) {
    await this.getById(id);
    if (input.leaderId) {
      await this.assertLeader(input.leaderId);
    }
    return prisma.ministry.update({
      where: { id },
      data: input,
      include: { leader: { select: USER_PUBLIC_SELECT } },
    });
  }

  async members(id: string) {
    await this.getById(id);
    return prisma.ministryMembership.findMany({
      where: { ministryId: id },
      include: {
        user: { select: USER_PUBLIC_SELECT },
      },
    });
  }

  async stats(id: string) {
    await this.getById(id);
    const [members, rehearsals, pendingAuditions] = await prisma.$transaction([
      prisma.ministryMembership.count({ where: { ministryId: id, status: 'ACTIVE' } }),
      prisma.rehearsal.count({ where: { ministryId: id } }),
      prisma.audition.count({ where: { ministryId: id, status: { in: ['PENDING', 'SCHEDULED'] } } }),
    ]);
    return { members, rehearsals, pendingAuditions };
  }

  private async assertLeader(leaderId: string) {
    const leader = await prisma.user.findUnique({ where: { id: leaderId }, select: { role: true } });
    if (!leader || (leader.role !== 'LEADER' && leader.role !== 'ADMIN' && leader.role !== 'DEVELOPER')) {
      throw AppError.unprocessable('Assigned leader is invalid');
    }
  }
}
