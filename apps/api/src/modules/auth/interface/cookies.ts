// apps/api/src/modules/auth/interface/cookies.ts
import type { CookieOptions, Response } from 'express';
import {
  REFRESH_COOKIE_NAME,
  REFRESH_COOKIE_PATH,
  REFRESH_TOKEN_TTL_SECONDS,
} from '../../../shared/config/constants';
import { env } from '../../../shared/config/env';

type NodeEnv = 'development' | 'test' | 'production';

/**
 * Refresh cookie flags for Vercel (web) + Railway (API) on different sites.
 * Production uses SameSite=None; Secure so the browser sends the cookie on
 * cross-origin XHR. Local/test keep Strict because both apps share localhost.
 */
export const buildRefreshCookieOptions = (nodeEnv: NodeEnv): CookieOptions => {
  const isProd = nodeEnv === 'production';
  return {
    httpOnly: true,
    sameSite: isProd ? 'none' : 'strict',
    secure: isProd,
    path: REFRESH_COOKIE_PATH,
    maxAge: REFRESH_TOKEN_TTL_SECONDS * 1000,
  };
};

const cookieOptions = (): CookieOptions => buildRefreshCookieOptions(env.NODE_ENV);

export const setRefreshCookie = (res: Response, token: string): void => {
  res.cookie(REFRESH_COOKIE_NAME, token, cookieOptions());
};

export const clearRefreshCookie = (res: Response): void => {
  const options = cookieOptions();
  res.clearCookie(REFRESH_COOKIE_NAME, {
    httpOnly: options.httpOnly,
    sameSite: options.sameSite,
    secure: options.secure,
    path: options.path,
  });
};
