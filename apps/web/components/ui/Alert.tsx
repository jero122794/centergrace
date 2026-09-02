// apps/web/components/ui/Alert.tsx
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface Props {
  children: ReactNode;
  tone?: 'danger' | 'info' | 'success';
}

const tones: Record<NonNullable<Props['tone']>, string> = {
  danger: 'border-l-danger-d bg-danger text-danger-d',
  info: 'border-l-accent bg-surface text-dark',
  success: 'border-l-success-d bg-success text-success-d',
};

/**
 * Inline status banner for forms and pages.
 */
export const Alert = ({ children, tone = 'danger' }: Props) => (
  <p role="alert" className={cn('border-l-[3px] py-2.5 pl-3.5 pr-3 text-sm', tones[tone])}>
    {children}
  </p>
);
