// apps/api/src/modules/users/application/use-cases/ListUsersUseCase.ts
import type { Role } from '@prisma/client';
import { paginate } from '../../../../shared/utils/pagination';
import { PrismaUserDirectoryRepository } from '../../infrastructure/repositories/PrismaUserDirectoryRepository';

export class ListUsersUseCase {
  constructor(private readonly users: PrismaUserDirectoryRepository) {}

  async execute(query: {
    role?: Role;
    isActive?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const pagination = paginate(query);
    const result = await this.users.list({ ...query, ...pagination });
    return { ...result, page: pagination.page, limit: pagination.limit };
  }
}
