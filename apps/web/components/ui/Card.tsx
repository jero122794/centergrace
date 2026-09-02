// apps/web/components/ui/Card.tsx
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type CardVariant = 'base' | 'surface' | 'accent' | 'devotional';

interface Props {
  children: ReactNode;
  className?: string;
  variant?: CardVariant;
  hover?: boolean;
}

const variants: Record<CardVariant, string> = {
  base: 'rounded-2xl border border-border bg-paper p-6 shadow-card',
  surface: 'rounded-2xl border border-border bg-surface p-6',
  accent: 'rounded-r-xl border-l-4 border-accent bg-paper p-6',
  devotional: 'rounded-b-2xl border-t-[6px] border-primary-d bg-paper p-7',
};

/**
 * Surface container for content blocks.
 *
 * @example
 * <Card variant="devotional">...</Card>
 */
export const Card = ({ children, className = '', variant = 'base', hover = false }: Props) => (
  <div
    className={cn(
      variants[variant],
      hover && 'transition duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-lift',
      className,
    )}
  >
    {children}
  </div>
);
