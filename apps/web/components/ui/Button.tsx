// apps/web/components/ui/Button.tsx
'use client';

import type { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
}

const styles: Record<NonNullable<Props['variant']>, string> = {
  primary: 'bg-teal text-white shadow-card hover:bg-teal-dark',
  secondary: 'bg-surface text-teal border border-teal/20 hover:border-teal/40 hover:bg-teal-mist',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  ghost: 'bg-transparent text-ink/70 hover:bg-teal-mist hover:text-teal',
};

export const Button = ({ variant = 'primary', className = '', ...props }: Props) => (
  <button
    className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:opacity-60 ${styles[variant]} ${className}`}
    {...props}
  />
);
