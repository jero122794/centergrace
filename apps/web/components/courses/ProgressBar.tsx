// apps/web/components/courses/ProgressBar.tsx
import { cx } from '@/lib/cn';
import styles from './ProgressBar.module.css';

interface Props {
  percent: number;
  className?: string;
}

/**
 * Course or lesson completion track. Fills from 0; shines when it reaches 100.
 */
export const ProgressBar = ({ percent, className }: Props) => {
  const value = Math.min(100, Math.max(0, percent));
  const done = value >= 100;
  return (
    <div className={cx(styles.row, className)}>
      <div className={styles.track}>
        <div className={cx(styles.fill, done && styles.done)} style={{ width: `${value}%` }} />
      </div>
      <span className={styles.label}>{value}%</span>
    </div>
  );
};
