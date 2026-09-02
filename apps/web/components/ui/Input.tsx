// apps/web/components/ui/Input.tsx
'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/cn';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

/**
 * Journal-style field: gold tick on the left, open bottom edge.
 */
export const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? props.name ?? label;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;
    return (
      <label className="field block" htmlFor={inputId}>
        <span className="field-label">{label}</span>
        <input
          id={inputId}
          ref={ref}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={cn('field-control', error && 'border-l-danger-d', className)}
          {...props}
        />
        {error ? (
          <span id={errorId} role="alert" className="mt-1 inline-flex items-center gap-1 text-xs text-danger-d">
            <AlertCircle className="h-3.5 w-3.5" aria-hidden />
            {error}
          </span>
        ) : hint ? (
          <span id={hintId} className="mt-1 block text-xs text-muted">
            {hint}
          </span>
        ) : null}
      </label>
    );
  },
);

Input.displayName = 'Input';
