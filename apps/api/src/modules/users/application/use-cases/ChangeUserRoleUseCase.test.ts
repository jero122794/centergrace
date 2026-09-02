// apps/api/src/modules/users/application/use-cases/ChangeUserRoleUseCase.test.ts
import { describe, expect, it, vi } from 'vitest';
import { ChangeUserRoleUseCase } from './ChangeUserRoleUseCase';
import { AppError } from '../../../../shared/utils/app-error';
import { PrismaUserDirectoryRepository } from '../../infrastructure/repositories/PrismaUserDirectoryRepository';

const directory = (target: { id: string; role: 'DEVELOPER' | 'ADMIN' | 'LEADER' | 'STUDENT' }) =>
  ({
    findPublicById: vi.fn().mockResolvedValue({
      ...target,
      name: 'Target',
      email: 'target@iglesia.com',
      isActive: true,
      mustChangePassword: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      googleSub: null,
    }),
    updateRole: vi.fn().mockImplementation(async (_id: string, role: string) => ({
      ...target,
      role,
    })),
  }) as unknown as PrismaUserDirectoryRepository;

describe('ChangeUserRoleUseCase', () => {
  it('lets an admin promote a student to leader', async () => {
    const users = directory({ id: 's1', role: 'STUDENT' });
    const useCase = new ChangeUserRoleUseCase(users);
    const result = await useCase.execute({ id: 'admin-1', role: 'ADMIN' }, 's1', 'LEADER');
    expect(result.role).toBe('LEADER');
  });

  it('blocks assigning the developer role', async () => {
    const useCase = new ChangeUserRoleUseCase(directory({ id: 's1', role: 'STUDENT' }));
    await expect(
      useCase.execute({ id: 'admin-1', role: 'ADMIN' }, 's1', 'DEVELOPER'),
    ).rejects.toBeInstanceOf(AppError);
  });
});
