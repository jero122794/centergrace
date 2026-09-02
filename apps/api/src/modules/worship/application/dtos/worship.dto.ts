// apps/api/src/modules/worship/application/dtos/worship.dto.ts
import { z } from 'zod';

export const createSongBodySchema = z.object({
  ministryId: z.string().min(1),
  title: z.string().min(1).max(180),
  artist: z.string().max(120).optional(),
  originalKey: z.string().min(1).max(8),
  chords: z.unknown(),
  lyrics: z.string().optional(),
  youtubeId: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

export const createRehearsalBodySchema = z.object({
  ministryId: z.string().min(1),
  date: z.string().datetime(),
  location: z.string().max(180).optional(),
  notes: z.string().max(4000).optional(),
  songs: z
    .array(
      z.object({
        songId: z.string(),
        order: z.number().int(),
        key: z.string(),
      }),
    )
    .default([]),
});

export const applyAuditionBodySchema = z.object({
  ministryId: z.string().min(1),
  musicalRole: z
    .enum(['VOCALIST', 'GUITARIST', 'BASSIST', 'DRUMMER', 'KEYBOARDIST', 'SOUND', 'OTHER'])
    .optional(),
});

export const rehearsalIdParamsSchema = z.object({ id: z.string().min(1) });
export const rehearsalSongParamsSchema = z.object({
  id: z.string().min(1),
  songId: z.string().min(1),
});

export const addRehearsalSongBodySchema = z.object({
  songId: z.string().min(1),
  order: z.number().int().nonnegative(),
  key: z.string().min(1).max(8),
});

export const updateRehearsalSongBodySchema = z.object({
  isReady: z.boolean().optional(),
  key: z.string().min(1).max(8).optional(),
  order: z.number().int().nonnegative().optional(),
});

export const updateAuditionBodySchema = z.object({
  status: z.enum(['PENDING', 'SCHOOL', 'ELIGIBLE', 'SCHEDULED', 'APPROVED', 'REJECTED', 'WAITLIST']),
  scheduledAt: z.string().datetime().optional(),
  musicalRole: z
    .enum(['VOCALIST', 'GUITARIST', 'BASSIST', 'DRUMMER', 'KEYBOARDIST', 'SOUND', 'OTHER'])
    .optional(),
  notes: z.string().max(4000).optional(),
});
