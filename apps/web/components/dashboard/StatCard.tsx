// apps/web/components/dashboard/StatCard.tsx
import type { CSSProperties, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cx } from '@/lib/cn';
import styles from './StatCard.module.css';

interface Props {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  accent?: 'accent' | 'gold' | 'success' | 'danger' | 'worship' | 'dev';
  enterDelay?: number;
}

const accents: Record<NonNullable<Props['accent']>, string | undefined> = {
  accent: undefined,
  gold: styles.gold,
  success: styles.success,
  danger: styles.danger,
  worship: styles.worship,
  dev: styles.dev,
};

/**
 * Typographic metric on a ledger line — not a boxed KPI tile.
 */
export const StatCard = ({ label, value, icon: Icon, accent = 'accent', enterDelay = 0 }: Props) => (
  <div className={cx(styles.item, accents[accent])} style={{ '--enter-delay': `${enterDelay}ms` } as CSSProperties}>
    <dt className={styles.label}>
      {Icon ? <Icon className={styles.icon} aria-hidden /> : null}
      {label}
    </dt>
    <dd className={styles.value}>{value}</dd>
  </div>
);

interface LedgerProps {
  children: ReactNode;
}

/**
 * Horizontal metric row used on dashboards.
 */
export const Ledger = ({ children }: LedgerProps) => <dl className={styles.ledger}>{children}</dl>;
