// apps/api/src/modules/auth/application/use-cases/LoginUserUseCase.ts
import { AuthDomainService } from '../../domain/services/AuthDomainService';
import type { IRefreshTokenRepository } from '../../domain/repositories/IRefreshTokenRepository';
import type { IUserRepository } from '../../domain/repositories/IUserRepository';
import { AppError } from '../../../../shared/utils/app-error';
import { verifySecret } from '../../../../shared/utils/crypto';
import { JwtAdapter } from '../../infrastructure/adapters/JwtAdapter';
import { issueSession, type IssuedSession } from '../session';
import type { LoginBody } from '../dtos/auth.dto';
import { toPublicAuthUser, type PublicAuthUser } from '../../domain/entities/AuthUser';

export class LoginUserUseCase {
  constructor(
    private readonly users: IUserRepository,
    private readonly refreshTokens: IRefreshTokenRepository,
    private readonly jwtAdapter: JwtAdapter,
    private readonly domain = new AuthDomainService(),
  ) {}

  /**
   * Authenticates email/password credentials and issues a rotating session.
   */
  async execute(input: LoginBody): Promise<{ user: PublicAuthUser; session: IssuedSession }> {
    const user = await this.users.findByEmail(input.email.toLowerCase());
    if (!user) {
      throw AppError.unauthorized('Invalid credentials');
    }
    const valid = await verifySecret(input.password, user.passwordHash);
    if (!valid) {
      throw AppError.unauthorized('Invalid credentials');
    }
    this.domain.assertActive(user);
    const publicUser = toPublicAuthUser({ ...user, createdAt: new Date() });
    const hydrated = await this.users.findPublicById(user.id);
    const sessionUser = hydrated ?? publicUser;
    const session = await issueSession(sessionUser, this.refreshTokens, this.jwtAdapter);
    return { user: sessionUser, session };
  }
}
