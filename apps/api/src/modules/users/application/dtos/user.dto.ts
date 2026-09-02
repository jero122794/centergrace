// apps/api/src/modules/users/application/dtos/user.dto.ts
import { z } from 'zod';
import { ASSIGNABLE_ROLES } from '../../../../shared/config/constants';

export const listUsersQuerySchema = z.object({
  role: z.enum(['DEVELOPER', 'ADMIN', 'LEADER', 'STUDENT']).optional(),
  isActive: z.enum(['true', 'false']).optional(),
  search: z.string().max(120).optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
});

export const updateUserBodySchema = z.object({
  name: z.string().min(2).max(120).optional(),
  email: z.string().email().optional(),
});

export const changeRoleBodySchema = z.object({
  role: z.enum(ASSIGNABLE_ROLES),
});

export const createStudentBodySchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
});

export const userIdParamsSchema = z.object({
  id: z.string().min(1),
});
