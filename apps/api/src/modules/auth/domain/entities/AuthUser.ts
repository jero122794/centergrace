// apps/api/src/modules/auth/domain/entities/AuthUser.ts
import type { Role } from '@prisma/client';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  isActive: boolean;
  mustChangePassword: boolean;
  googleSub: string | null;
}

export interface PublicAuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  mustChangePassword: boolean;
  createdAt: Date;
}

export const toPublicAuthUser = (
  user: Omit<AuthUser, 'passwordHash'> & { createdAt: Date },
): PublicAuthUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  mustChangePassword: user.mustChangePassword,
  createdAt: user.createdAt,
});
