// apps/web/hooks/useTransposer.ts
'use client';

import { useMemo, useState } from 'react';
import { transposeChord } from '@/lib/transposer';

export const useTransposer = (originalKey: string) => {
  const [semitones, setSemitones] = useState(0);
  const transpose = (chord: string): string => transposeChord(chord, semitones);
  const currentKey = useMemo(() => transposeChord(originalKey, semitones), [originalKey, semitones]);
  return { semitones, setSemitones, transpose, currentKey };
};
