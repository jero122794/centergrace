// apps/api/src/modules/auth/application/use-cases/LogoutUserUseCase.ts
import type { IRefreshTokenRepository } from '../../domain/repositories/IRefreshTokenRepository';
import { AppError } from '../../../../shared/utils/app-error';
import { verifySecret } from '../../../../shared/utils/crypto';

export class LogoutUserUseCase {
  constructor(private readonly refreshTokens: IRefreshTokenRepository) {}

  /**
   * Deletes the presented refresh token from persistence.
   */
  async execute(rawToken: string | undefined): Promise<void> {
    if (!rawToken) {
      return;
    }
    const separator = rawToken.indexOf('.');
    if (separator <= 0) {
      return;
    }
    const id = rawToken.slice(0, separator);
    const secret = rawToken.slice(separator + 1);
    const stored = await this.refreshTokens.findById(id);
    if (!stored) {
      return;
    }
    const matches = await verifySecret(secret, stored.tokenHash);
    if (!matches) {
      throw AppError.unauthorized('Invalid refresh token');
    }
    await this.refreshTokens.deleteById(stored.id);
  }
}
