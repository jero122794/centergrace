// apps/web/components/ui/Button.tsx
'use client';

import type { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
}

const styles: Record<NonNullable<Props['variant']>, string> = {
  primary: 'bg-teal text-white hover:bg-teal-dark',
  secondary: 'bg-white text-teal border border-teal hover:bg-cream',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  ghost: 'bg-transparent text-ink hover:bg-white/60',
};

export const Button = ({ variant = 'primary', className = '', ...props }: Props) => (
  <button
    className={`rounded-xl px-4 py-2 text-sm font-semibold transition disabled:opacity-60 ${styles[variant]} ${className}`}
    {...props}
  />
);
