// apps/web/components/developer/SystemMetricCard.tsx
import type { CSSProperties } from 'react';
import { cx } from '@/lib/cn';
import styles from './SystemMetricCard.module.css';

interface Props {
  label: string;
  value: string | number;
  unit?: string;
  status?: 'ok' | 'warn' | 'crit';
  percent?: number;
  enterDelay?: number;
}

const dots: Record<NonNullable<Props['status']>, string> = {
  ok: styles.ok,
  warn: styles.warn,
  crit: styles.crit,
};

/**
 * Technical metric tile for the developer panel.
 */
export const SystemMetricCard = ({ label, value, unit, status = 'ok', percent, enterDelay = 0 }: Props) => (
  <div className={styles.card} style={{ '--enter-delay': `${enterDelay}ms` } as CSSProperties}>
    <div className={styles.head}>
      <p className={styles.label}>{label}</p>
      <span className={cx(styles.dot, dots[status])} />
    </div>
    <p className={styles.value}>
      {value}
      {unit ? <span className={styles.unit}>{unit}</span> : null}
    </p>
    {typeof percent === 'number' ? (
      <div className={styles.track}>
        <div
          className={cx(
            styles.fill,
            percent < 60 ? styles.fillOk : percent < 85 ? styles.fillWarn : styles.fillCrit,
          )}
          style={{ width: `${Math.min(100, percent)}%` }}
        />
      </div>
    ) : null}
  </div>
);
