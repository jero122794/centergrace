// apps/api/src/modules/auth/application/use-cases/GoogleOAuthUseCase.ts
import { randomBytes } from 'crypto';
import type { IRefreshTokenRepository } from '../../domain/repositories/IRefreshTokenRepository';
import type { IUserRepository } from '../../domain/repositories/IUserRepository';
import { hashSecret } from '../../../../shared/utils/crypto';
import { JwtAdapter } from '../../infrastructure/adapters/JwtAdapter';
import { GoogleOAuthAdapter } from '../../infrastructure/adapters/GoogleOAuthAdapter';
import { issueSession, type IssuedSession } from '../session';
import type { PublicAuthUser } from '../../domain/entities/AuthUser';
import { toPublicAuthUser } from '../../domain/entities/AuthUser';
import { AuthDomainService } from '../../domain/services/AuthDomainService';

export class GoogleOAuthUseCase {
  constructor(
    private readonly users: IUserRepository,
    private readonly refreshTokens: IRefreshTokenRepository,
    private readonly jwtAdapter: JwtAdapter,
    private readonly google: GoogleOAuthAdapter,
    private readonly domain = new AuthDomainService(),
  ) {}

  buildAuthorizationUrl(state: string): string {
    return this.google.buildAuthorizationUrl(state);
  }

  /**
   * Completes the Google OAuth2 callback and issues a session.
   */
  async complete(code: string): Promise<{ user: PublicAuthUser; session: IssuedSession }> {
    const profile = await this.google.exchangeCode(code);
    const existing =
      (await this.users.findByGoogleSub(profile.sub)) ??
      (await this.users.findByEmail(profile.email.toLowerCase()));
    const user = existing
      ? toPublicAuthUser({ ...existing, createdAt: new Date() })
      : await this.createFromGoogle(profile.email, profile.name, profile.sub);
    const persisted = (await this.users.findPublicById(user.id)) ?? user;
    this.domain.assertActive({ ...persisted, passwordHash: '', googleSub: profile.sub });
    const session = await issueSession(persisted, this.refreshTokens, this.jwtAdapter);
    return { user: persisted, session };
  }

  private async createFromGoogle(email: string, name: string, googleSub: string) {
    const passwordHash = await hashSecret(randomBytes(24).toString('base64url'));
    return this.users.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: 'STUDENT',
      mustChangePassword: false,
      googleSub,
    });
  }
}
