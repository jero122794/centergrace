// apps/web/components/ui/Input.tsx
'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id ?? props.name ?? label;
    return (
      <label className="block space-y-1.5" htmlFor={inputId}>
        <span className="text-sm font-medium text-ink">{label}</span>
        <input
          id={inputId}
          ref={ref}
          className={`w-full rounded-xl border border-teal/15 bg-white px-3 py-2.5 outline-none ring-teal transition focus:border-teal/40 focus:ring-2 ${className}`}
          {...props}
        />
        {error ? <span className="text-xs text-red-600">{error}</span> : null}
      </label>
    );
  },
);

Input.displayName = 'Input';
