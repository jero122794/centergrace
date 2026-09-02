// apps/api/src/modules/users/application/use-cases/UpdateUserUseCase.ts
import { AppError } from '../../../../shared/utils/app-error';
import { UserDomainService } from '../../domain/services/UserDomainService';
import { PrismaUserDirectoryRepository } from '../../infrastructure/repositories/PrismaUserDirectoryRepository';
import type { Role } from '@prisma/client';
import { prisma } from '../../../../shared/config/prisma';

export class UpdateUserUseCase {
  constructor(
    private readonly users: PrismaUserDirectoryRepository,
    private readonly domain = new UserDomainService(),
  ) {}

  async execute(
    actor: { id: string; role: Role },
    targetId: string,
    data: { name?: string; email?: string },
  ) {
    const target = await this.users.findPublicById(targetId);
    if (!target) {
      throw AppError.notFound('User not found');
    }
    this.domain.assertCanMutate(actor.role, actor.id, target);
    if (data.email) {
      const taken = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
      if (taken && taken.id !== targetId) {
        throw AppError.conflict('Email is already in use');
      }
    }
    return this.users.update(targetId, {
      name: data.name,
      email: data.email?.toLowerCase(),
    });
  }
}
