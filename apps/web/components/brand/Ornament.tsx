// apps/web/components/brand/Ornament.tsx
import { cx } from '@/lib/cn';
import styles from './Ornament.module.css';

interface Props {
  className?: string;
  label?: string;
}

/**
 * Olive-branch hairline used as an editorial divider.
 */
export const Ornament = ({ className, label }: Props) => (
  <div className={cx(styles.root, className)} role="presentation">
    <span className={styles.line} />
    <svg viewBox="0 0 48 16" className={styles.leaf} aria-hidden>
      <path
        d="M8 10c6-7 12-8 16-8 4 0 10 1 16 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path d="M24 3c1.6 2.2 2.4 4.2 2.4 6.1 0 2.2-1.1 4-2.4 5.2-1.3-1.2-2.4-3-2.4-5.2 0-1.9.8-3.9 2.4-6.1Z" fill="currentColor" />
    </svg>
    {label ? <span className={styles.label}>{label}</span> : null}
    <span className={styles.line} />
  </div>
);
