// apps/web/components/ui/Skeleton.tsx
import { cx } from '@/lib/cn';
import styles from './Skeleton.module.css';

interface Props {
  className?: string;
  lines?: number;
}

/**
 * Shimmer placeholder while content loads.
 *
 * @example
 * <Skeleton lines={3} />
 */
export const Skeleton = ({ className, lines }: Props) => {
  if (lines) {
    return (
      <div className={styles.stack}>
        {Array.from({ length: lines }).map((_, index) => (
          <div key={index} className={styles.bar} />
        ))}
      </div>
    );
  }
  return <div className={cx(styles.bar, className)} />;
};
