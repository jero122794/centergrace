// apps/web/components/layout/PageWrapper.tsx
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface Props {
  children: ReactNode;
  className?: string;
}

/**
 * Constrains main content to the 1280px reading column.
 */
export const PageWrapper = ({ children, className }: Props) => (
  <div className={cn('mx-auto w-full max-w-content animate-fadein', className)}>{children}</div>
);
