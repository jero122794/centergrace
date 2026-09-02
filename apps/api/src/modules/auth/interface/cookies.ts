// apps/api/src/modules/auth/interface/cookies.ts
import type { CookieOptions, Response } from 'express';
import {
  REFRESH_COOKIE_NAME,
  REFRESH_COOKIE_PATH,
  REFRESH_TOKEN_TTL_SECONDS,
} from '../../../shared/config/constants';
import { env } from '../../../shared/config/env';

const cookieOptions = (): CookieOptions => ({
  httpOnly: true,
  sameSite: 'strict',
  secure: env.NODE_ENV === 'production',
  path: REFRESH_COOKIE_PATH,
  maxAge: REFRESH_TOKEN_TTL_SECONDS * 1000,
});

/**
 * Stores the rotating refresh token in a tightly scoped HttpOnly cookie.
 */
export const setRefreshCookie = (res: Response, token: string): void => {
  res.cookie(REFRESH_COOKIE_NAME, token, cookieOptions());
};

/**
 * Clears the refresh cookie on logout.
 */
export const clearRefreshCookie = (res: Response): void => {
  res.clearCookie(REFRESH_COOKIE_NAME, {
    httpOnly: true,
    sameSite: 'strict',
    secure: env.NODE_ENV === 'production',
    path: REFRESH_COOKIE_PATH,
  });
};
