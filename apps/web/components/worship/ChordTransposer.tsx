// apps/web/components/worship/ChordTransposer.tsx
'use client';

import { useEffect, useState } from 'react';
import { KEYS } from '@/lib/transposer';
import { useTransposer } from '@/hooks/useTransposer';
import { cx } from '@/lib/cn';
import styles from './ChordTransposer.module.css';

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
 * Changing the key retunes chords with a blur+scale — not a generic fade.
 */
export const ChordTransposer = ({ originalKey, chords }: Props) => {
  const { setSemitones, transpose, currentKey } = useTransposer(originalKey);
  const currentIndex = KEYS.indexOf(currentKey as (typeof KEYS)[number]);
  const originalIndex = KEYS.indexOf(originalKey as (typeof KEYS)[number]);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    setPulse(true);
    const timer = window.setTimeout(() => setPulse(false), 420);
    return () => window.clearTimeout(timer);
  }, [currentKey]);

  return (
    <div className={styles.wrap}>
      <div className={styles.keys} role="group" aria-label="Tonalidad">
        {KEYS.map((note, index) => (
          <button
            type="button"
            key={note}
            onClick={() => setSemitones(index - (originalIndex < 0 ? 0 : originalIndex))}
            className={cx(styles.key, currentIndex === index && styles.active)}
            aria-pressed={currentIndex === index}
          >
            {note}
          </button>
        ))}
      </div>
      {chords.sections.map((section) => (
        <div key={section.name} className={styles.section}>
          <p className={styles.sectionName}>{section.name}</p>
          {section.lines.map((line) => (
            <div key={line.lyrics} className={styles.line}>
              <p className={cx(styles.chords, pulse && styles.retune)}>
                {line.chords.map((chord) => transpose(chord)).join('  ')}
              </p>
              <p className={styles.lyrics}>{line.lyrics}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
