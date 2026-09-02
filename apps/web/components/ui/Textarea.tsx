// apps/web/components/ui/Textarea.tsx
'use client';

import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { AlertCircle } from 'lucide-react';
import { cx } from '@/lib/cn';
import styles from './Textarea.module.css';

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
  minChars?: number;
  maxChars?: number;
}

const counterClass = (length: number, minChars?: number, maxChars?: number): string => {
  if (typeof maxChars === 'number' && length > maxChars) {
    return styles.over;
  }
  if (typeof maxChars === 'number' && length >= maxChars * 0.9) {
    return styles.warn;
  }
  if (typeof minChars === 'number' && length >= minChars) {
    return styles.ok;
  }
  return styles.counter;
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
      <label className={styles.field} htmlFor={inputId}>
        <span className={styles.label}>{label}</span>
        <textarea
          id={inputId}
          ref={ref}
          value={value}
          defaultValue={defaultValue}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={cx(styles.control, Boolean(error) && styles.invalid, className)}
          {...props}
        />
        <span className={styles.meta}>
          {error ? (
            <span id={errorId} role="alert" className={cx(styles.message, styles.error)}>
              <AlertCircle className={styles.icon} aria-hidden />
              {error}
            </span>
          ) : hint ? (
            <span id={hintId} className={styles.message}>
              {hint}
            </span>
          ) : (
            <span />
          )}
          {typeof minChars === 'number' || typeof maxChars === 'number' ? (
            <span className={cx(styles.counter, counterClass(current, minChars, maxChars))}>
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
