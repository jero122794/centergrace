// apps/api/src/modules/groups/application/dtos/group.dto.ts
import { z } from 'zod';

export const createGroupBodySchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().max(2000).optional(),
  type: z.enum(['MINISTRY', 'CELL', 'BIBLE_CLASS', 'PRAYER', 'OTHER']),
  ministryId: z.string().min(1).optional(),
});

export const groupIdParamsSchema = z.object({ id: z.string().min(1) });
export const groupMemberParamsSchema = z.object({ id: z.string().min(1), userId: z.string().min(1) });
export const addMemberBodySchema = z.object({ userId: z.string().min(1) });
