// apps/web/components/ui/Input.tsx
'use client';

import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { cx } from '@/lib/cn';
import styles from './Input.module.css';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  suffix?: ReactNode;
}

/**
 * Journal-style field: gold tick on the left, open bottom edge.
 *
 * @param suffix Optional trailing control (password visibility).
 */
export const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, hint, suffix, className, id, ...props }, ref) => {
    const inputId = id ?? props.name ?? label;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;
    return (
      <label className={styles.field} htmlFor={inputId}>
        <span className={styles.label}>{label}</span>
        <span className={styles.controlWrap}>
          <input
            id={inputId}
            ref={ref}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            className={cx(styles.control, Boolean(error) && styles.invalid, Boolean(suffix) && styles.withSuffix, className)}
            {...props}
          />
          {suffix ? <span className={styles.suffix}>{suffix}</span> : null}
        </span>
        {error ? (
          <span id={errorId} role="alert" className={cx(styles.message, styles.error)}>
            <AlertCircle className={styles.icon} aria-hidden />
            {error}
          </span>
        ) : hint ? (
          <span id={hintId} className={styles.message}>
            {hint}
          </span>
        ) : null}
      </label>
    );
  },
);

Input.displayName = 'Input';
