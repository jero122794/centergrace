// apps/web/components/brand/Logo.tsx
import { cx } from '@/lib/cn';
import styles from './Logo.module.css';

interface Props {
  className?: string;
  compact?: boolean;
  inverted?: boolean;
}

/**
 * Wordmark with an oval olive mark. `inverted` for the dark rail.
 */
export const Logo = ({ className, compact = false, inverted = false }: Props) => (
  <div className={cx(styles.wrap, inverted && styles.inverted, className)}>
    <span className={styles.mark} aria-hidden>
      <svg viewBox="0 0 32 32" fill="none">
        <path
          d="M16 5.5c3.1 3.6 4.6 7.1 4.6 10.2 0 3.6-1.9 6.5-4.6 8.4-2.7-1.9-4.6-4.8-4.6-8.4 0-3.1 1.5-6.6 4.6-10.2Z"
          fill="currentColor"
        />
        <path
          d="M7.5 19c3.8.15 6.6 1.9 8.5 4.8 1.9-2.9 4.7-4.65 8.5-4.8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </span>
    {compact ? null : (
      <span className={styles.word}>
        <span className={styles.name}>Centro de Gracia</span>
        <span className={styles.sub}>Centro Misionero Shalom</span>
      </span>
    )}
  </div>
);
