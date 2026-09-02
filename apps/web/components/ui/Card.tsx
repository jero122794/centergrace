// apps/web/components/ui/Card.tsx
import type { CSSProperties, ReactNode } from 'react';
import { cx } from '@/lib/cn';
import styles from './Card.module.css';

export type CardVariant = 'base' | 'surface' | 'accent' | 'devotional';

interface Props {
  children: ReactNode;
  className?: string;
  variant?: CardVariant;
  hover?: boolean;
  selected?: boolean;
  enterDelay?: number;
}

const variants: Record<CardVariant, string> = {
  base: styles.sheet,
  surface: cx(styles.sheet, styles.surface),
  accent: cx(styles.sheet, styles.accent),
  devotional: cx(styles.sheet, styles.devotional),
};

/**
 * Paper sheet used as a content surface. Radii are intentionally uneven.
 *
 * @param enterDelay Stagger in milliseconds. Capped by the caller at 60ms steps.
 * @param selected Strong inset ring for list + detail layouts.
 */
export const Card = ({
  children,
  className = '',
  variant = 'base',
  hover = false,
  selected = false,
  enterDelay = 0,
}: Props) => (
  <div
    className={cx(variants[variant], hover && styles.hover, selected && styles.selected, className)}
    style={{ '--enter-delay': `${enterDelay}ms` } as CSSProperties}
  >
    {children}
  </div>
);
