// apps/api/src/modules/auth/application/use-cases/LoginUserUseCase.test.ts
import { describe, expect, it, vi } from 'vitest';
import { LoginUserUseCase } from './LoginUserUseCase';
import { AppError } from '../../../../shared/utils/app-error';
import { hashSecret } from '../../../../shared/utils/crypto';
import type { IUserRepository } from '../../domain/repositories/IUserRepository';
import type { IRefreshTokenRepository } from '../../domain/repositories/IRefreshTokenRepository';
import type { AuthUser, PublicAuthUser } from '../../domain/entities/AuthUser';
import { JwtAdapter } from '../../infrastructure/adapters/JwtAdapter';

const password = 'Clave123!';

const buildUser = async (): Promise<AuthUser> => ({
  id: 'user-1',
  name: 'Estudiante',
  email: 'estudiante@iglesia.com',
  passwordHash: await hashSecret(password),
  role: 'STUDENT',
  isActive: true,
  mustChangePassword: false,
  googleSub: null,
});

const publicUser = (user: AuthUser): PublicAuthUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  mustChangePassword: user.mustChangePassword,
  createdAt: new Date('2026-01-01'),
});

describe('LoginUserUseCase', () => {
  it('issues a session for valid credentials', async () => {
    const user = await buildUser();
    const users: IUserRepository = {
      findByEmail: vi.fn().mockResolvedValue(user),
      findById: vi.fn(),
      findPublicById: vi.fn().mockResolvedValue(publicUser(user)),
      findByGoogleSub: vi.fn(),
      create: vi.fn(),
      updatePassword: vi.fn(),
    };
    const refreshTokens: IRefreshTokenRepository = {
      create: vi.fn().mockResolvedValue({
        id: 'rt-1',
        userId: user.id,
        tokenHash: 'hash',
        expiresAt: new Date(Date.now() + 1000),
        usedAt: null,
      }),
      findById: vi.fn(),
      findByHash: vi.fn(),
      markUsed: vi.fn(),
      deleteById: vi.fn(),
      deleteAllForUser: vi.fn(),
    };
    const useCase = new LoginUserUseCase(users, refreshTokens, new JwtAdapter());
    const result = await useCase.execute({ email: user.email, password });
    expect(result.user.email).toBe(user.email);
    expect(result.session.accessToken.length).toBeGreaterThan(20);
  });

  it('rejects unknown emails', async () => {
    const users = { findByEmail: vi.fn().mockResolvedValue(null) } as unknown as IUserRepository;
    const useCase = new LoginUserUseCase(
      users,
      {} as IRefreshTokenRepository,
      new JwtAdapter(),
    );
    await expect(useCase.execute({ email: 'nadie@iglesia.com', password })).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
