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
 * Labeled text field with inline error support (WCAG 2.1 AA).
 *
 * @example
 * <Input label="Correo" type="email" error={errors.email?.message} />
 */
export const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? props.name ?? label;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;
    return (
      <label className="block" htmlFor={inputId}>
        <span className="mb-1.5 block text-xs font-medium text-muted">{label}</span>
        <input
          id={inputId}
          ref={ref}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={cn(
            'w-full rounded-[10px] border-[1.5px] bg-paper px-3.5 py-2.5 text-[15px] text-dark placeholder:text-hint',
            error
              ? 'border-danger-d ring-danger focus:ring-[3px]'
              : 'border-border focus:border-border-f focus:ring-[3px] focus:ring-primary/30',
            'outline-none transition disabled:bg-bg disabled:opacity-60',
            className,
          )}
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
