// apps/api/src/modules/auth/application/use-cases/RefreshSessionUseCase.ts
import { AuthDomainService } from '../../domain/services/AuthDomainService';
import type { IRefreshTokenRepository } from '../../domain/repositories/IRefreshTokenRepository';
import type { IUserRepository } from '../../domain/repositories/IUserRepository';
import { AppError } from '../../../../shared/utils/app-error';
import { verifySecret } from '../../../../shared/utils/crypto';
import { JwtAdapter } from '../../infrastructure/adapters/JwtAdapter';
import { issueSession, type IssuedSession } from '../session';
import type { PublicAuthUser } from '../../domain/entities/AuthUser';

const splitRefreshToken = (raw: string): { id: string; secret: string } => {
  const separator = raw.indexOf('.');
  if (separator <= 0 || separator === raw.length - 1) {
    throw AppError.unauthorized('Invalid refresh token');
  }
  return { id: raw.slice(0, separator), secret: raw.slice(separator + 1) };
};

export class RefreshSessionUseCase {
  constructor(
    private readonly users: IUserRepository,
    private readonly refreshTokens: IRefreshTokenRepository,
    private readonly jwtAdapter: JwtAdapter,
    private readonly domain = new AuthDomainService(),
  ) {}

  /**
   * Rotates a refresh token. Reuse of a spent token invalidates the whole family.
   */
  async execute(rawToken: string): Promise<{ user: PublicAuthUser; session: IssuedSession }> {
    const { id, secret } = splitRefreshToken(rawToken);
    const stored = await this.refreshTokens.findById(id);
    if (!stored) {
      throw AppError.unauthorized('Invalid refresh token');
    }
    const matches = await verifySecret(secret, stored.tokenHash);
    if (!matches) {
      throw AppError.unauthorized('Invalid refresh token');
    }
    if (stored.usedAt) {
      await this.refreshTokens.deleteAllForUser(stored.userId);
      throw AppError.unauthorized('Refresh token reuse detected');
    }
    this.domain.assertRefreshReusable(stored, new Date());
    return this.rotate(stored.userId, stored.id);
  }

  private async rotate(userId: string, tokenId: string) {
    const user = await this.users.findPublicById(userId);
    if (!user) {
      throw AppError.unauthorized('Invalid refresh token');
    }
    this.domain.assertActive({ ...user, passwordHash: '', googleSub: null });
    await this.refreshTokens.markUsed(tokenId, new Date());
    const session = await issueSession(user, this.refreshTokens, this.jwtAdapter);
    return { user, session };
  }
}
