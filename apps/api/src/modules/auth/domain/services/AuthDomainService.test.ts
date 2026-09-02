// apps/api/src/modules/auth/domain/services/AuthDomainService.test.ts
import { describe, expect, it } from 'vitest';
import { AuthDomainService } from './AuthDomainService';
import { AppError } from '../../../../shared/utils/app-error';
import type { AuthUser } from '../entities/AuthUser';

const service = new AuthDomainService();

const user = (overrides: Partial<AuthUser> = {}): AuthUser => ({
  id: 'u1',
  name: 'Test',
  email: 'test@iglesia.com',
  passwordHash: 'hash',
  role: 'STUDENT',
  isActive: true,
  mustChangePassword: false,
  googleSub: null,
  ...overrides,
});

describe('AuthDomainService', () => {
  it('rejects deactivated accounts', () => {
    expect(() => service.assertActive(user({ isActive: false }))).toThrow(AppError);
  });

  it('detects used refresh tokens', () => {
    expect(() =>
      service.assertRefreshReusable(
        {
          id: 't1',
          userId: 'u1',
          tokenHash: 'hash',
          expiresAt: new Date(Date.now() + 1000),
          usedAt: new Date(),
        },
        new Date(),
      ),
    ).toThrow(/reuse/i);
  });
});
