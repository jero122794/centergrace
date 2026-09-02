// apps/api/src/modules/auth/application/use-cases/RegisterUserUseCase.ts
import { AuthDomainService } from '../../domain/services/AuthDomainService';
import type { IRefreshTokenRepository } from '../../domain/repositories/IRefreshTokenRepository';
import type { IUserRepository } from '../../domain/repositories/IUserRepository';
import { AppError } from '../../../../shared/utils/app-error';
import { hashSecret } from '../../../../shared/utils/crypto';
import { JwtAdapter } from '../../infrastructure/adapters/JwtAdapter';
import { SesEmailAdapter } from '../../infrastructure/adapters/SesEmailAdapter';
import { issueSession, type IssuedSession } from '../session';
import type { RegisterBody } from '../dtos/auth.dto';
import type { PublicAuthUser } from '../../domain/entities/AuthUser';

export class RegisterUserUseCase {
  constructor(
    private readonly users: IUserRepository,
    private readonly refreshTokens: IRefreshTokenRepository,
    private readonly jwtAdapter: JwtAdapter,
    private readonly emailAdapter: SesEmailAdapter,
    private readonly domain = new AuthDomainService(),
  ) {}

  /**
   * Creates a STUDENT account, emails a welcome message and opens a session.
   */
  async execute(input: RegisterBody): Promise<{ user: PublicAuthUser; session: IssuedSession }> {
    const existing = await this.users.findByEmail(input.email.toLowerCase());
    if (existing) {
      throw AppError.conflict('Email is already registered');
    }
    const passwordHash = await hashSecret(input.password);
    const user = await this.users.create({
      name: input.name,
      email: input.email.toLowerCase(),
      passwordHash,
      role: 'STUDENT',
      mustChangePassword: false,
    });
    this.domain.assertActive({ ...user, passwordHash, googleSub: null });
    await this.emailAdapter.sendWelcome({ to: user.email, name: user.name });
    const session = await issueSession(user, this.refreshTokens, this.jwtAdapter);
    return { user, session };
  }
}
