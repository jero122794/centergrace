// apps/api/src/modules/users/application/use-cases/CreateStudentUseCase.ts
import { PrismaUserRepository } from '../../../auth/infrastructure/repositories/PrismaUserRepository';
import { SesEmailAdapter } from '../../../auth/infrastructure/adapters/SesEmailAdapter';
import { generateTemporaryPassword, hashSecret } from '../../../../shared/utils/crypto';
import { AppError } from '../../../../shared/utils/app-error';

export class CreateStudentUseCase {
  constructor(
    private readonly users: PrismaUserRepository,
    private readonly email: SesEmailAdapter,
  ) {}

  /**
   * Leader-created STUDENT with a temporary password and welcome email.
   */
  async execute(actorId: string, input: { name: string; email: string }) {
    const existing = await this.users.findByEmail(input.email.toLowerCase());
    if (existing) {
      throw AppError.conflict('Email is already registered');
    }
    const temporaryPassword = generateTemporaryPassword();
    const passwordHash = await hashSecret(temporaryPassword);
    const user = await this.users.create({
      name: input.name,
      email: input.email.toLowerCase(),
      passwordHash,
      role: 'STUDENT',
      mustChangePassword: true,
      createdById: actorId,
    });
    await this.email.sendWelcome({ to: user.email, name: user.name, temporaryPassword });
    return user;
  }
}
