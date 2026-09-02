// apps/api/src/modules/devotionals/application/dtos/devotional.dto.ts
import { z } from 'zod';

export const createDevotionalBodySchema = z.object({
  title: z.string().min(3).max(180),
  content: z.unknown(),
  verse: z.string().max(500).optional(),
  mediaUrl: z.string().optional(),
  mediaType: z.enum(['audio', 'youtube']).optional(),
  date: z.string().date(),
  scope: z.enum(['GLOBAL', 'GROUP']).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
  groupId: z.string().optional(),
  questions: z.array(z.object({ text: z.string().min(3), order: z.number().int() })).default([]),
});

export const participateBodySchema = z.object({
  content: z.string().min(3).max(8000),
  answers: z.array(z.object({ questionId: z.string(), answer: z.string().min(1) })),
});

export const devotionalIdParamsSchema = z.object({ id: z.string().min(1) });
