// apps/web/components/dashboard/ActivityHeatmap.tsx
import { cx } from '@/lib/cn';
import styles from './ActivityHeatmap.module.css';

interface Props {
  days: boolean[];
  label?: string;
}

/**
 * Seven-day activity dots. Pass newest day last.
 *
 * @example
 * <ActivityHeatmap days={[true, false, true, true, true, true, true]} />
 */
export const ActivityHeatmap = ({ days, label = 'Actividad de la semana' }: Props) => (
  <div>
    <p className={styles.label}>{label}</p>
    <div className={styles.row} role="img" aria-label={label}>
      {days.map((active, index) => (
        <span
          key={index}
          className={cx(styles.dot, active && styles.on, index === days.length - 1 && styles.today)}
        />
      ))}
    </div>
  </div>
);
