import { describe, expect, it } from 'vitest';
import { buildRefreshCookieOptions } from './cookies';

describe('buildRefreshCookieOptions', () => {
  it('keeps SameSite=Strict on localhost', () => {
    expect(buildRefreshCookieOptions('test')).toMatchObject({
      httpOnly: true,
      sameSite: 'strict',
      secure: false,
      path: '/api/auth',
    });
  });

  it('uses SameSite=None; Secure in production for Vercel + Railway', () => {
    expect(buildRefreshCookieOptions('production')).toMatchObject({
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      path: '/api/auth',
    });
  });
});
