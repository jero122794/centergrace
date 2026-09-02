// apps/api/src/modules/auth/application/use-cases/GetCurrentUserUseCase.ts
import type { IUserRepository } from '../../domain/repositories/IUserRepository';
import { AppError } from '../../../../shared/utils/app-error';
import type { PublicAuthUser } from '../../domain/entities/AuthUser';

export class GetCurrentUserUseCase {
  constructor(private readonly users: IUserRepository) {}

  /**
   * Returns the authenticated user without passwordHash.
   */
  async execute(userId: string): Promise<PublicAuthUser> {
    const user = await this.users.findPublicById(userId);
    if (!user) {
      throw AppError.notFound('User not found');
    }
    return user;
  }
}
