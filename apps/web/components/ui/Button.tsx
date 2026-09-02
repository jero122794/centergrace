// apps/web/components/ui/Button.tsx
'use client';

import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'icon';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const styles: Record<ButtonVariant, string> = {
  primary: 'btn-grace',
  secondary: 'btn-grace btn-grace--quiet',
  ghost: 'btn-grace btn-grace--ghost',
  danger: 'btn-grace btn-grace--danger',
  icon: 'btn-grace btn-grace--icon',
};

/**
 * Action button with an organic, slightly uneven pill.
 */
export const Button = ({ variant = 'primary', className, type = 'button', ...props }: Props) => (
  <button
    type={type}
    className={cn(
      'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      styles[variant],
      className,
    )}
    {...props}
  />
);
