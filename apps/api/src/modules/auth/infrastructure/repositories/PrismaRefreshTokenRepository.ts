// apps/api/src/modules/auth/infrastructure/repositories/PrismaRefreshTokenRepository.ts
import { prisma } from '../../../../shared/config/prisma';
import type {
  IRefreshTokenRepository,
  StoredRefreshToken,
} from '../../domain/repositories/IRefreshTokenRepository';

export class PrismaRefreshTokenRepository implements IRefreshTokenRepository {
  async create(userId: string, tokenHash: string, expiresAt: Date): Promise<StoredRefreshToken> {
    return prisma.refreshToken.create({ data: { userId, tokenHash, expiresAt } });
  }

  async findById(id: string): Promise<StoredRefreshToken | null> {
    return prisma.refreshToken.findUnique({ where: { id } });
  }

  async findByHash(tokenHash: string): Promise<StoredRefreshToken | null> {
    return prisma.refreshToken.findUnique({ where: { tokenHash } });
  }

  async markUsed(id: string, usedAt: Date): Promise<void> {
    await prisma.refreshToken.update({ where: { id }, data: { usedAt } });
  }

  async deleteById(id: string): Promise<void> {
    await prisma.refreshToken.delete({ where: { id } });
  }

  async deleteAllForUser(userId: string): Promise<void> {
    await prisma.refreshToken.deleteMany({ where: { userId } });
  }
}
