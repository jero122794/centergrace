# Auth module

## Purpose

Handles registration, login, JWT RS256 access tokens, rotating refresh tokens, password changes and Google OAuth2.

## Use cases

- `RegisterUserUseCase` — create STUDENT, send welcome email, open session
- `LoginUserUseCase` — verify credentials, issue session
- `RefreshSessionUseCase` — rotate refresh token; reuse invalidates the whole family
- `LogoutUserUseCase` — delete stored refresh token
- `ChangePasswordUseCase` — update hash and clear `mustChangePassword`
- `GetCurrentUserUseCase` — public profile without `passwordHash`
- `GoogleOAuthUseCase` — authorization-code flow

## Endpoints

| Method | Path | Auth |
| --- | --- | --- |
| POST | `/api/auth/register` | public, rate-limited |
| POST | `/api/auth/login` | public, rate-limited |
| POST | `/api/auth/refresh` | refresh cookie |
| POST | `/api/auth/logout` | refresh cookie |
| GET | `/api/auth/me` | Bearer |
| POST | `/api/auth/change-password` | Bearer |
| GET | `/api/auth/google` | public |
| GET | `/api/auth/google/callback` | public |

## Contracts

Success: `{ data: { user, accessToken }, message? }`

Refresh cookie: HttpOnly, SameSite=Strict, Secure in production, Path=`/api/auth/refresh`.
