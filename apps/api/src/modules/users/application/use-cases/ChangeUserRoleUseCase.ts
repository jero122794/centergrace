// apps/api/src/modules/users/application/use-cases/ChangeUserRoleUseCase.ts
import type { Role } from '@prisma/client';
import { AppError } from '../../../../shared/utils/app-error';
import { UserDomainService } from '../../domain/services/UserDomainService';
import { PrismaUserDirectoryRepository } from '../../infrastructure/repositories/PrismaUserDirectoryRepository';

export class ChangeUserRoleUseCase {
  constructor(
    private readonly users: PrismaUserDirectoryRepository,
    private readonly domain = new UserDomainService(),
  ) {}

  async execute(actor: { id: string; role: Role }, targetId: string, role: Role) {
    this.domain.assertAssignableRole(role);
    const target = await this.users.findPublicById(targetId);
    if (!target) {
      throw AppError.notFound('User not found');
    }
    this.domain.assertCanMutate(actor.role, actor.id, target);
    return this.users.updateRole(targetId, role);
  }
}
