// apps/web/components/grading/GradeBadge.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { cx } from '@/lib/cn';
import styles from './GradeBadge.module.css';

interface Props {
  score: number | null;
  status?: string;
  large?: boolean;
}

type Band = 'pending' | 'good' | 'mid' | 'low';

const bandOf = (score: number | null, status?: string): Band => {
  if ((status && status !== 'GRADED') || score === null) {
    return 'pending';
  }
  if (score >= 70) {
    return 'good';
  }
  if (score >= 50) {
    return 'mid';
  }
  return 'low';
};

/**
 * Numeric grade chip. When the slider crosses a band, the number flips on the X axis.
 */
export const GradeBadge = ({ score, status, large = false }: Props) => {
  const band = bandOf(score, status);
  const previous = useRef(band);
  const [flip, setFlip] = useState(false);

  useEffect(() => {
    if (previous.current !== band) {
      setFlip(true);
      const timer = window.setTimeout(() => setFlip(false), 360);
      previous.current = band;
      return () => window.clearTimeout(timer);
    }
    previous.current = band;
    return undefined;
  }, [band]);

  if (band === 'pending') {
    return <span className={cx(styles.badge, styles.pending)}>Pendiente</span>;
  }

  return (
    <span className={cx(styles.badge, large && styles.large, styles[band])}>
      <span className={cx(flip && styles.flip)}>
        {score}/100
      </span>
    </span>
  );
};
