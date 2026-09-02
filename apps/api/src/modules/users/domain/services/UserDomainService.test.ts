// apps/api/src/modules/users/domain/services/UserDomainService.test.ts
import { describe, expect, it } from 'vitest';
import { UserDomainService } from './UserDomainService';

const service = new UserDomainService();

describe('UserDomainService', () => {
  it('blocks mutations against the developer account', () => {
    expect(() =>
      service.assertCanMutate('ADMIN', 'admin-1', { id: 'dev-1', role: 'DEVELOPER' }),
    ).toThrow(/developer/i);
  });

  it('blocks an admin from modifying another admin', () => {
    expect(() =>
      service.assertCanMutate('ADMIN', 'admin-1', { id: 'admin-2', role: 'ADMIN' }),
    ).toThrow(/another admin/i);
  });

  it('rejects assigning the developer role', () => {
    expect(() => service.assertAssignableRole('DEVELOPER')).toThrow(/cannot be assigned/i);
  });
});
