// apps/api/src/modules/users/infrastructure/repositories/PrismaUserDirectoryRepository.ts
import type { Prisma, Role } from '@prisma/client';
import { prisma, USER_PUBLIC_SELECT } from '../../../../shared/config/prisma';

export class PrismaUserDirectoryRepository {
  async list(filters: {
    role?: Role;
    isActive?: boolean;
    search?: string;
    skip: number;
    take: number;
  }) {
    const where: Prisma.UserWhereInput = {
      role: filters.role,
      isActive: filters.isActive,
      OR: filters.search
        ? [
            { name: { contains: filters.search, mode: 'insensitive' } },
            { email: { contains: filters.search, mode: 'insensitive' } },
          ]
        : undefined,
    };
    const [data, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        select: USER_PUBLIC_SELECT,
        skip: filters.skip,
        take: filters.take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);
    return { data, total };
  }

  async findPublicById(id: string) {
    return prisma.user.findUnique({ where: { id }, select: USER_PUBLIC_SELECT });
  }

  async update(id: string, data: { name?: string; email?: string }) {
    return prisma.user.update({ where: { id }, data, select: USER_PUBLIC_SELECT });
  }

  async updateRole(id: string, role: Role) {
    return prisma.user.update({ where: { id }, data: { role }, select: USER_PUBLIC_SELECT });
  }

  async toggleActive(id: string, isActive: boolean) {
    return prisma.user.update({ where: { id }, data: { isActive }, select: USER_PUBLIC_SELECT });
  }
}
