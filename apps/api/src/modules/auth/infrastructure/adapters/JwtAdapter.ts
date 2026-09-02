// apps/api/src/modules/auth/infrastructure/adapters/JwtAdapter.ts
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_TTL_SECONDS } from '../../../../shared/config/constants';
import { env } from '../../../../shared/config/env';
import type { Role } from '@prisma/client';

export interface JwtClaims {
  sub: string;
  role: Role;
  mustChangePassword: boolean;
}

/**
 * Issues RS256 access tokens with a 15-minute TTL.
 */
export class JwtAdapter {
  signAccessToken(claims: JwtClaims): string {
    return jwt.sign(claims, env.JWT_PRIVATE_KEY, {
      algorithm: 'RS256',
      expiresIn: ACCESS_TOKEN_TTL_SECONDS,
    });
  }
}
