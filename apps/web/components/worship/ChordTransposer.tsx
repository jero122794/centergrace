// apps/web/components/worship/ChordTransposer.tsx
'use client';

import { useTransposer } from '@/hooks/useTransposer';
import { Button } from '@/components/ui/Button';

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

export const ChordTransposer = ({ originalKey, chords }: Props) => {
  const { semitones, setSemitones, transpose, currentKey } = useTransposer(originalKey);
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="secondary" type="button" onClick={() => setSemitones((value) => value - 1)}>
          -
        </Button>
        <p className="text-sm">
          Tonalidad: <strong>{currentKey}</strong> ({semitones} semitonos)
        </p>
        <Button variant="secondary" type="button" onClick={() => setSemitones((value) => value + 1)}>
          +
        </Button>
      </div>
      {chords.sections.map((section) => (
        <div key={section.name}>
          <p className="text-xs font-semibold uppercase text-teal">{section.name}</p>
          {section.lines.map((line) => (
            <div key={line.lyrics} className="mt-2 font-mono text-sm">
              <p className="text-teal">{line.chords.map((chord) => transpose(chord)).join('  ')}</p>
              <p>{line.lyrics}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
