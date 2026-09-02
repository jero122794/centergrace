// apps/web/components/dashboard/StreakCard.tsx
'use client';

import { useEffect, useState } from 'react';
import { cx } from '@/lib/cn';
import styles from './StreakCard.module.css';

interface Props {
  days: number;
}

/**
 * Consecutive-activity streak. The number counts from 0 in 800ms, then lands with a scale pulse.
 *
 * @param days Real streak value from the dashboard API.
 */
export const StreakCard = ({ days }: Props) => {
  const [shown, setShown] = useState(0);
  const [landed, setLanded] = useState(false);
  const dots = Array.from({ length: 7 }, (_, index) => index >= 7 - Math.min(days, 7));

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || days <= 0) {
      setShown(days);
      setLanded(true);
      return;
    }
    const start = performance.now();
    let frame = 0;
    const tick = (now: number): void => {
      const t = Math.min(1, (now - start) / 800);
      const eased = 1 - (1 - t) ** 3;
      setShown(Math.round(days * eased));
      if (t < 1) {
        frame = window.requestAnimationFrame(tick);
      } else {
        setLanded(true);
      }
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [days]);

  return (
    <div className={styles.item}>
      <dt className={styles.label}>Días consecutivos</dt>
      <dd className={styles.row}>
        <span className={cx(styles.number, landed && styles.landed)}>{shown}</span>
        <span className={styles.dots} aria-hidden>
          {dots.map((active, index) => (
            <span
              key={index}
              className={cx(styles.dot, active && styles.on, index === 6 && styles.today)}
            />
          ))}
        </span>
      </dd>
    </div>
  );
};
