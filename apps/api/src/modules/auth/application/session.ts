// apps/api/src/modules/auth/application/session.ts
import { REFRESH_TOKEN_TTL_SECONDS } from '../../../shared/config/constants';
import { generateOpaqueToken, hashSecret } from '../../../shared/utils/crypto';
import type { IRefreshTokenRepository } from '../domain/repositories/IRefreshTokenRepository';
import { JwtAdapter } from '../infrastructure/adapters/JwtAdapter';
import type { PublicAuthUser } from '../domain/entities/AuthUser';

export interface IssuedSession {
  accessToken: string;
  refreshToken: string;
}

/**
 * Issues an access JWT plus a newly stored rotating refresh token.
 */
export const issueSession = async (
  user: PublicAuthUser,
  refreshTokens: IRefreshTokenRepository,
  jwtAdapter: JwtAdapter,
): Promise<IssuedSession> => {
  const accessToken = jwtAdapter.signAccessToken({
    sub: user.id,
    role: user.role,
    mustChangePassword: user.mustChangePassword,
  });
  const secret = generateOpaqueToken();
  const tokenHash = await hashSecret(secret);
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000);
  const stored = await refreshTokens.create(user.id, tokenHash, expiresAt);
  return { accessToken, refreshToken: `${stored.id}.${secret}` };
};
