// apps/api/src/modules/auth/domain/repositories/IRefreshTokenRepository.ts
export interface StoredRefreshToken {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  usedAt: Date | null;
}

export interface IRefreshTokenRepository {
  create(userId: string, tokenHash: string, expiresAt: Date): Promise<StoredRefreshToken>;
  findById(id: string): Promise<StoredRefreshToken | null>;
  findByHash(tokenHash: string): Promise<StoredRefreshToken | null>;
  markUsed(id: string, usedAt: Date): Promise<void>;
  deleteById(id: string): Promise<void>;
  deleteAllForUser(userId: string): Promise<void>;
}
