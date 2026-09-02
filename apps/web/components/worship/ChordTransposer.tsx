// apps/web/components/worship/ChordTransposer.tsx
'use client';

import { KEYS } from '@/lib/transposer';
import { useTransposer } from '@/hooks/useTransposer';
import { cn } from '@/lib/cn';

interface ChordLine {
  lyrics: string;
  chords: string[];
}

interface Section {
  name: string;
  lines: ChordLine[];
}

interface Props {
  originalKey: string;
  chords: { sections: Section[] };
}

/**
 * Client-side key selector and chord chart.
 */
export const ChordTransposer = ({ originalKey, chords }: Props) => {
  const { setSemitones, transpose, currentKey } = useTransposer(originalKey);
  const currentIndex = KEYS.indexOf(currentKey as (typeof KEYS)[number]);
  const originalIndex = KEYS.indexOf(originalKey as (typeof KEYS)[number]);

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-1 lg:grid lg:grid-cols-6 lg:overflow-visible">
        {KEYS.map((note, index) => (
          <button
            type="button"
            key={note}
            onClick={() => setSemitones(index - (originalIndex < 0 ? 0 : originalIndex))}
            className={cn(
              'h-9 w-9 shrink-0 rounded-full text-sm font-semibold',
              currentIndex === index ? 'bg-worship text-white shadow-card' : 'bg-worship-l text-worship hover:bg-worship/70 hover:text-white',
            )}
          >
            {note}
          </button>
        ))}
      </div>
      {chords.sections.map((section) => (
        <div key={section.name} className="rounded-2xl border border-worship/20 bg-worship-l/50 p-4">
          <p className="text-[11px] font-bold uppercase tracking-wide text-worship">{section.name}</p>
          {section.lines.map((line) => (
            <div key={line.lyrics} className="mt-3">
              <p className="font-mono text-base font-semibold text-dark">
                {line.chords.map((chord) => transpose(chord)).join('  ')}
              </p>
              <p className="text-sm text-muted">{line.lyrics}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
