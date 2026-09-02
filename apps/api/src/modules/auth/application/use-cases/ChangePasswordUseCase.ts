// apps/api/src/modules/auth/application/use-cases/ChangePasswordUseCase.ts
import { AuthDomainService } from '../../domain/services/AuthDomainService';
import type { IUserRepository } from '../../domain/repositories/IUserRepository';
import { AppError } from '../../../../shared/utils/app-error';
import { hashSecret, verifySecret } from '../../../../shared/utils/crypto';
import type { ChangePasswordBody } from '../dtos/auth.dto';

export class ChangePasswordUseCase {
  constructor(
    private readonly users: IUserRepository,
    private readonly domain = new AuthDomainService(),
  ) {}

  /**
   * Updates the authenticated user's password and clears mustChangePassword.
   */
  async execute(actorId: string, input: ChangePasswordBody): Promise<void> {
    const user = await this.users.findById(actorId);
    if (!user) {
      throw AppError.notFound('User not found');
    }
    this.domain.canEditPassword(user, actorId);
    const matches = await verifySecret(input.currentPassword, user.passwordHash);
    if (!matches) {
      throw AppError.unauthorized('Current password is incorrect');
    }
    const nextHash = await hashSecret(input.newPassword);
    await this.users.updatePassword(user.id, nextHash);
  }
}
