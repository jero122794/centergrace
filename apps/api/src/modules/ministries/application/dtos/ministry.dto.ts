// apps/api/src/modules/ministries/application/dtos/ministry.dto.ts
import { z } from 'zod';

export const createMinistryBodySchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().max(2000).optional(),
  type: z.enum(['MINISTRY', 'CELL', 'BIBLE_CLASS', 'PRAYER', 'OTHER']),
  coverImage: z.string().url().optional(),
  leaderId: z.string().min(1),
});

export const updateMinistryBodySchema = createMinistryBodySchema.partial();
export const ministryIdParamsSchema = z.object({ id: z.string().min(1) });
