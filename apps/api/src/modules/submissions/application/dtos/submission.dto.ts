// apps/api/src/modules/submissions/application/dtos/submission.dto.ts
import { z } from 'zod';

export const createSubmissionBodySchema = z.object({
  lessonId: z.string().min(1),
  content: z.string().min(1).max(20000),
  fileUrl: z.string().url().optional(),
});

export const gradeBodySchema = z.object({
  score: z.number().int().min(0).max(100),
  feedback: z.string().max(5000).optional(),
});

export const submissionIdParamsSchema = z.object({ id: z.string().min(1) });
