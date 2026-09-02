// apps/api/src/modules/users/domain/services/UserDomainService.ts
import type { Role } from '@prisma/client';
import { PROTECTED_ROLE } from '../../../../shared/config/constants';
import { AppError } from '../../../../shared/utils/app-error';

export interface UserGuardTarget {
  id: string;
  role: Role;
}

/**
 * RBAC rules that protect the DEVELOPER principal and peer admins.
 */
export class UserDomainService {
  assertCanMutate(actorRole: Role, actorId: string, target: UserGuardTarget): void {
    if (target.role === PROTECTED_ROLE) {
      throw AppError.forbidden('The developer account cannot be modified');
    }
    if (actorRole === 'ADMIN' && target.role === 'ADMIN' && actorId !== target.id) {
      throw AppError.forbidden('An admin cannot modify another admin');
    }
  }

  assertAssignableRole(role: Role): void {
    if (role === PROTECTED_ROLE) {
      throw AppError.forbidden('The developer role cannot be assigned');
    }
  }
}
