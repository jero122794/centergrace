// apps/api/src/modules/auth/infrastructure/repositories/PrismaUserRepository.ts
import { prisma, USER_PUBLIC_SELECT } from '../../../../shared/config/prisma';
import type { AuthUser, PublicAuthUser } from '../../domain/entities/AuthUser';
import type { CreateUserInput, IUserRepository } from '../../domain/repositories/IUserRepository';

const AUTH_SELECT = {
  ...USER_PUBLIC_SELECT,
  passwordHash: true,
} as const;

export class PrismaUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<AuthUser | null> {
    return prisma.user.findUnique({ where: { email }, select: AUTH_SELECT });
  }

  async findById(id: string): Promise<AuthUser | null> {
    return prisma.user.findUnique({ where: { id }, select: AUTH_SELECT });
  }

  async findPublicById(id: string): Promise<PublicAuthUser | null> {
    return prisma.user.findUnique({ where: { id }, select: USER_PUBLIC_SELECT });
  }

  async findByGoogleSub(googleSub: string): Promise<AuthUser | null> {
    return prisma.user.findUnique({ where: { googleSub }, select: AUTH_SELECT });
  }

  async create(input: CreateUserInput): Promise<PublicAuthUser> {
    return prisma.user.create({ data: input, select: USER_PUBLIC_SELECT });
  }

  async updatePassword(id: string, passwordHash: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { passwordHash, mustChangePassword: false },
    });
  }
}
