// apps/api/src/modules/auth/domain/repositories/IUserRepository.ts
import type { Role } from '@prisma/client';
import type { AuthUser, PublicAuthUser } from '../entities/AuthUser';

export interface CreateUserInput {
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  mustChangePassword: boolean;
  createdById?: string;
  googleSub?: string;
}

export interface IUserRepository {
  findByEmail(email: string): Promise<AuthUser | null>;
  findById(id: string): Promise<AuthUser | null>;
  findPublicById(id: string): Promise<PublicAuthUser | null>;
  findByGoogleSub(googleSub: string): Promise<AuthUser | null>;
  create(input: CreateUserInput): Promise<PublicAuthUser>;
  updatePassword(id: string, passwordHash: string): Promise<void>;
}
