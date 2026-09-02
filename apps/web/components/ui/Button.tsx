// apps/web/components/ui/Button.tsx
'use client';

import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'icon';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const styles: Record<ButtonVariant, string> = {
  primary:
    'rounded-pill bg-accent px-6 py-2.5 text-sm font-semibold text-white shadow-card hover:-translate-y-px hover:bg-accent-hover active:translate-y-0 active:bg-accent-active',
  secondary:
    'rounded-pill border-[1.5px] border-primary-d bg-surface px-6 py-2.5 text-sm font-semibold text-accent hover:bg-primary/20',
  ghost: 'rounded-lg bg-transparent px-4 py-2 text-sm font-semibold text-accent hover:bg-surface',
  danger:
    'rounded-pill border border-danger-d/30 bg-danger px-6 py-2.5 text-sm font-semibold text-danger-d hover:bg-[#FFAEB5]',
  icon: 'h-10 w-10 rounded-[10px] bg-transparent p-0 text-muted hover:bg-surface hover:text-accent',
};

/**
 * Action button used across Centro de Gracia.
 *
 * @example
 * <Button variant="primary">Iniciar sesión</Button>
 */
export const Button = ({ variant = 'primary', className, type = 'button', ...props }: Props) => (
  <button
    type={type}
    className={cn(
      'inline-flex items-center justify-center gap-2 transition duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0',
      styles[variant],
      className,
    )}
    {...props}
  />
);
