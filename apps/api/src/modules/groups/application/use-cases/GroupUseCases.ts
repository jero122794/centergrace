// apps/api/src/modules/groups/application/use-cases/GroupUseCases.ts
import type { Role } from '@prisma/client';
import { prisma, USER_PUBLIC_SELECT } from '../../../../shared/config/prisma';
import { AppError } from '../../../../shared/utils/app-error';
import { PushNotificationService } from '../../../notifications/infrastructure/PushNotificationService';

export class GroupUseCases {
  constructor(private readonly push = new PushNotificationService()) {}

  async list(actor: { id: string; role: Role }) {
    const where =
      actor.role === 'LEADER' ? { OR: [{ leaderId: actor.id }, { createdById: actor.id }] } : {};
    return prisma.group.findMany({
      where,
      include: { leader: { select: USER_PUBLIC_SELECT }, _count: { select: { memberships: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(
    actor: { id: string; role: Role },
    input: { name: string; description?: string; type: 'MINISTRY' | 'CELL' | 'BIBLE_CLASS' | 'PRAYER' | 'OTHER'; ministryId?: string },
  ) {
    if (actor.role === 'LEADER' && input.ministryId) {
      const ministry = await prisma.ministry.findUnique({ where: { id: input.ministryId } });
      if (!ministry || ministry.leaderId !== actor.id) {
        throw AppError.forbidden('Leaders may only attach groups to their own ministry');
      }
    }
    return prisma.group.create({
      data: {
        name: input.name,
        description: input.description,
        type: input.type,
        ministryId: input.ministryId,
        leaderId: actor.id,
        createdById: actor.id,
      },
    });
  }

  async getById(actor: { id: string; role: Role }, id: string) {
    const group = await prisma.group.findUnique({
      where: { id },
      include: { memberships: { include: { user: { select: USER_PUBLIC_SELECT } } } },
    });
    if (!group) {
      throw AppError.notFound('Group not found');
    }
    this.assertAccess(actor, group.leaderId);
    return group;
  }

  async addMember(actor: { id: string; role: Role }, groupId: string, userId: string) {
    const group = await this.getById(actor, groupId);
    const membership = await prisma.groupMembership.upsert({
      where: { userId_groupId: { userId, groupId } },
      update: { status: 'ACTIVE' },
      create: { userId, groupId, addedById: actor.id },
    });
    await this.push.sendToUser(userId, {
      title: 'Nuevo grupo',
      body: `Te agregaron a ${group.name}`,
    });
    return membership;
  }

  async removeMember(actor: { id: string; role: Role }, groupId: string, userId: string) {
    await this.getById(actor, groupId);
    await prisma.groupMembership.delete({
      where: { userId_groupId: { userId, groupId } },
    });
  }

  async members(actor: { id: string; role: Role }, groupId: string) {
    await this.getById(actor, groupId);
    return prisma.groupMembership.findMany({
      where: { groupId },
      include: { user: { select: USER_PUBLIC_SELECT } },
    });
  }

  private assertAccess(actor: { id: string; role: Role }, leaderId: string) {
    if (actor.role === 'LEADER' && actor.id !== leaderId) {
      throw AppError.forbidden('You can only manage your own groups');
    }
  }
}
