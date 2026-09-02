// apps/api/src/modules/auth/domain/services/AuthDomainService.ts
import { AppError } from '../../../../shared/utils/app-error';
import type { AuthUser } from '../entities/AuthUser';
import type { StoredRefreshToken } from '../repositories/IRefreshTokenRepository';

/**
 * Pure authentication rules with no infrastructure imports besides errors.
 */
export class AuthDomainService {
  assertActive(user: AuthUser): void {
    if (!user.isActive) {
      throw AppError.forbidden('Account is deactivated');
    }
  }

  assertRefreshReusable(token: StoredRefreshToken, now: Date): void {
    if (token.usedAt) {
      throw AppError.unauthorized('Refresh token reuse detected');
    }
    if (token.expiresAt.getTime() <= now.getTime()) {
      throw AppError.unauthorized('Refresh token expired');
    }
  }

  canEditPassword(user: AuthUser, actorId: string): void {
    if (user.id !== actorId) {
      throw AppError.forbidden('Cannot change another user password');
    }
  }
}
