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
  base: 'sheet',
  surface: 'sheet sheet--quiet',
  accent: 'sheet sheet--accent',
  devotional: 'sheet--ribbon',
};

/**
 * Paper sheet used as a content surface. Radii are intentionally uneven.
 */
export const Card = ({ children, className = '', variant = 'base', hover = false }: Props) => (
  <div className={cn(variants[variant], hover && 'sheet-hover', className)}>{children}</div>
);
