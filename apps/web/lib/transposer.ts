// apps/web/lib/transposer.ts
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;
const FLAT_MAP: Record<string, string> = { Db: 'C#', Eb: 'D#', Gb: 'F#', Ab: 'G#', Bb: 'A#' };

const normalize = (note: string): string => FLAT_MAP[note] ?? note;

/**
 * Transposes a chord symbol by the given number of semitones.
 */
export const transposeChord = (chord: string, semitones: number): string => {
  const match = chord.match(/^([A-G][b#]?)(.*)$/);
  if (!match) {
    return chord;
  }
  const root = normalize(match[1] ?? 'C');
  const suffix = match[2] ?? '';
  const index = NOTES.indexOf(root as (typeof NOTES)[number]);
  if (index < 0) {
    return chord;
  }
  const next = NOTES[(index + semitones + NOTES.length * 4) % NOTES.length];
  return `${next}${suffix}`;
};

export const KEYS = NOTES;
