// apps/api/src/modules/auth/infrastructure/adapters/GoogleOAuthAdapter.ts
import { env } from '../../../../shared/config/env';
import { AppError } from '../../../../shared/utils/app-error';

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';

export interface GoogleProfile {
  sub: string;
  email: string;
  name: string;
}

/**
 * Google OAuth2 authorization-code adapter.
 */
export class GoogleOAuthAdapter {
  isConfigured(): boolean {
    return Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET);
  }

  buildAuthorizationUrl(state: string): string {
    this.assertConfigured();
    const callback = env.GOOGLE_CALLBACK_URL ?? `${env.FRONTEND_URL.replace(/\/$/, '')}/api/auth/google/callback`;
    const params = new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID,
      redirect_uri: callback,
      response_type: 'code',
      scope: 'openid email profile',
      state,
      prompt: 'select_account',
    });
    return `${GOOGLE_AUTH_URL}?${params.toString()}`;
  }

  async exchangeCode(code: string): Promise<GoogleProfile> {
    this.assertConfigured();
    const callback = env.GOOGLE_CALLBACK_URL ?? `${env.FRONTEND_URL.replace(/\/$/, '')}/api/auth/google/callback`;
    const tokenRes = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        redirect_uri: callback,
        grant_type: 'authorization_code',
      }),
    });
    if (!tokenRes.ok) {
      throw AppError.unauthorized('Google authorization failed');
    }
    const tokenJson = (await tokenRes.json()) as { access_token?: string };
    if (!tokenJson.access_token) {
      throw AppError.unauthorized('Google authorization failed');
    }
    return this.fetchProfile(tokenJson.access_token);
  }

  private async fetchProfile(accessToken: string): Promise<GoogleProfile> {
    const profileRes = await fetch(GOOGLE_USERINFO_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!profileRes.ok) {
      throw AppError.unauthorized('Unable to load Google profile');
    }
    const profile = (await profileRes.json()) as Partial<GoogleProfile>;
    if (!profile.sub || !profile.email || !profile.name) {
      throw AppError.unauthorized('Google profile is incomplete');
    }
    return { sub: profile.sub, email: profile.email, name: profile.name };
  }

  private assertConfigured(): void {
    if (!this.isConfigured()) {
      throw AppError.unprocessable('Google OAuth is not configured');
    }
  }
}
