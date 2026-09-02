// apps/api/src/modules/auth/interface/controllers/AuthController.ts
import type { Request, Response } from 'express';
import { randomBytes } from 'crypto';
import { env } from '../../../../shared/config/env';
import { sendSuccess } from '../../../../shared/utils/http';
import { REFRESH_COOKIE_NAME } from '../../../../shared/config/constants';
import type { AuthenticatedRequest } from '../../../../shared/middleware/auth.middleware';
import { RegisterUserUseCase } from '../../application/use-cases/RegisterUserUseCase';
import { LoginUserUseCase } from '../../application/use-cases/LoginUserUseCase';
import { RefreshSessionUseCase } from '../../application/use-cases/RefreshSessionUseCase';
import { LogoutUserUseCase } from '../../application/use-cases/LogoutUserUseCase';
import { ChangePasswordUseCase } from '../../application/use-cases/ChangePasswordUseCase';
import { GetCurrentUserUseCase } from '../../application/use-cases/GetCurrentUserUseCase';
import { GoogleOAuthUseCase } from '../../application/use-cases/GoogleOAuthUseCase';
import { clearRefreshCookie, setRefreshCookie } from '../cookies';

export class AuthController {
  constructor(
    private readonly registerUser: RegisterUserUseCase,
    private readonly loginUser: LoginUserUseCase,
    private readonly refreshSession: RefreshSessionUseCase,
    private readonly logoutUser: LogoutUserUseCase,
    private readonly changePassword: ChangePasswordUseCase,
    private readonly getCurrentUser: GetCurrentUserUseCase,
    private readonly googleOAuth: GoogleOAuthUseCase,
  ) {}

  register = async (req: Request, res: Response): Promise<void> => {
    const result = await this.registerUser.execute(req.body);
    setRefreshCookie(res, result.session.refreshToken);
    sendSuccess(res, { user: result.user, accessToken: result.session.accessToken }, 201);
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const result = await this.loginUser.execute(req.body);
    setRefreshCookie(res, result.session.refreshToken);
    sendSuccess(res, { user: result.user, accessToken: result.session.accessToken });
  };

  refresh = async (req: Request, res: Response): Promise<void> => {
    const raw = req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined;
    const result = await this.refreshSession.execute(raw ?? '');
    setRefreshCookie(res, result.session.refreshToken);
    sendSuccess(res, { user: result.user, accessToken: result.session.accessToken });
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    const raw = req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined;
    await this.logoutUser.execute(raw);
    clearRefreshCookie(res);
    sendSuccess(res, { ok: true }, 200, 'Signed out');
  };

  me = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const user = await this.getCurrentUser.execute(req.user?.sub ?? '');
    sendSuccess(res, user);
  };

  changePasswordHandler = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    await this.changePassword.execute(req.user?.sub ?? '', req.body);
    sendSuccess(res, { ok: true }, 200, 'Password updated');
  };

  googleStart = async (_req: Request, res: Response): Promise<void> => {
    const state = randomBytes(16).toString('hex');
    const url = this.googleOAuth.buildAuthorizationUrl(state);
    res.redirect(url);
  };

  googleCallback = async (req: Request, res: Response): Promise<void> => {
    const code = String(req.query.code ?? '');
    const result = await this.googleOAuth.complete(code);
    setRefreshCookie(res, result.session.refreshToken);
    const redirect = new URL('/auth/callback', env.FRONTEND_URL);
    redirect.searchParams.set('accessToken', result.session.accessToken);
    res.redirect(redirect.toString());
  };
}
