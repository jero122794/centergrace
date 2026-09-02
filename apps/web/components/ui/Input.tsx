// apps/web/components/ui/Input.tsx
'use client';

import type { InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = ({ label, error, className = '', id, ...props }: Props) => {
  const inputId = id ?? props.name ?? label;
  return (
    <label className="block space-y-1" htmlFor={inputId}>
      <span className="text-sm font-medium text-ink">{label}</span>
      <input
        id={inputId}
        className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none ring-teal focus:ring-2 ${className}`}
        {...props}
      />
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
};
