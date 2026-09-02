// apps/web/components/ui/Alert.tsx
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface Props {
  children: ReactNode;
  tone?: 'danger' | 'info' | 'success';
}

const tones: Record<NonNullable<Props['tone']>, string> = {
  danger: 'border-danger-d/30 bg-danger text-danger-d',
  info: 'border-primary bg-surface text-dark',
  success: 'border-success-d/20 bg-success text-success-d',
};

/**
 * Inline status banner for forms and pages.
 */
export const Alert = ({ children, tone = 'danger' }: Props) => (
  <p role="alert" className={cn('rounded-xl border px-3.5 py-2.5 text-sm', tones[tone])}>
    {children}
  </p>
);
