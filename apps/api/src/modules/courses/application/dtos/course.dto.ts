// apps/api/src/modules/courses/application/dtos/course.dto.ts
import { z } from 'zod';

export const createCourseBodySchema = z.object({
  title: z.string().min(3).max(180),
  description: z.string().min(3).max(5000),
  coverImage: z.string().url().optional(),
  scope: z.enum(['GLOBAL', 'GROUP']).optional(),
  groupId: z.string().min(1).optional(),
});

export const updateCourseBodySchema = createCourseBodySchema.partial().extend({
  isActive: z.boolean().optional(),
});

export const courseIdParamsSchema = z.object({ id: z.string().min(1) });
export const lessonIdParamsSchema = z.object({ id: z.string().min(1) });

export const createModuleBodySchema = z.object({
  title: z.string().min(2).max(180),
  order: z.number().int().nonnegative(),
});

export const createLessonBodySchema = z.object({
  title: z.string().min(2).max(180),
  bodyContent: z.unknown(),
  moduleId: z.string().min(1).optional(),
  youtubeUrl: z.string().optional(),
  order: z.number().int().nonnegative(),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
  hasAssignment: z.boolean().optional(),
  assignmentDescription: z.string().max(5000).optional(),
});

export const updateLessonBodySchema = z.object({
  title: z.string().min(2).max(180).optional(),
  bodyContent: z.unknown().optional(),
  moduleId: z.string().min(1).nullable().optional(),
  youtubeUrl: z.string().optional(),
  order: z.number().int().nonnegative().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
  hasAssignment: z.boolean().optional(),
  assignmentDescription: z.string().max(5000).nullable().optional(),
});

export const oembedQuerySchema = z.object({
  url: z.string().min(1),
});

export const enrollBodySchema = z.object({
  userId: z.string().min(1),
});
