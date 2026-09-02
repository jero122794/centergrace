// apps/web/components/ui/Textarea.tsx
'use client';

import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/cn';

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
  minChars?: number;
  maxChars?: number;
}

const counterTone = (length: number, minChars?: number, maxChars?: number): string => {
  if (typeof maxChars === 'number' && length > maxChars) {
    return 'text-danger-d';
  }
  if (typeof maxChars === 'number' && length >= maxChars * 0.9) {
    return 'text-warning-d';
  }
  if (typeof minChars === 'number' && length >= minChars) {
    return 'text-success-d';
  }
  return 'text-hint';
};

/**
 * Labeled textarea with an optional character counter.
 *
 * @example
 * <Textarea label="Reflexión" minChars={30} maxChars={500} />
 */
export const Textarea = forwardRef<HTMLTextAreaElement, Props>(
  ({ label, error, hint, className, id, minChars, maxChars, value, defaultValue, ...props }, ref) => {
    const inputId = id ?? props.name ?? label;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;
    const current = typeof value === 'string' ? value.length : typeof defaultValue === 'string' ? defaultValue.length : 0;
    return (
      <label className="field block" htmlFor={inputId}>
        <span className="field-label">{label}</span>
        <textarea
          id={inputId}
          ref={ref}
          value={value}
          defaultValue={defaultValue}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={cn('field-control min-h-[100px] resize-y leading-[1.7]', error && 'border-l-danger-d', className)}
          {...props}
        />
        <span className="mt-1 flex items-start justify-between gap-2">
          {error ? (
            <span id={errorId} role="alert" className="inline-flex items-center gap-1 text-xs text-danger-d">
              <AlertCircle className="h-3.5 w-3.5" aria-hidden />
              {error}
            </span>
          ) : hint ? (
            <span id={hintId} className="text-xs text-muted">
              {hint}
            </span>
          ) : (
            <span />
          )}
          {typeof minChars === 'number' || typeof maxChars === 'number' ? (
            <span className={cn('text-right text-[11px]', counterTone(current, minChars, maxChars))}>
              {current}
              {typeof maxChars === 'number' ? ` / ${maxChars}` : ''}
            </span>
          ) : null}
        </span>
      </label>
    );
  },
);

Textarea.displayName = 'Textarea';
