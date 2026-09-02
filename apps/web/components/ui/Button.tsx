// apps/web/components/ui/Button.tsx
'use client';

import { useState, type ButtonHTMLAttributes, type MouseEvent } from 'react';
import { cx } from '@/lib/cn';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'icon';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary: styles.primary,
  secondary: styles.secondary,
  ghost: styles.ghost,
  danger: styles.danger,
  icon: styles.icon,
};

interface RipplePoint {
  x: number;
  y: number;
  id: number;
}

/**
 * Action button. Primary shines on hover; click drops a ripple at the touch point.
 *
 * @param variant Visual treatment. Primary is terracotta — the one a 17-year-old actually taps.
 * @param fullWidth Stretch to the parent width (forms, lesson complete).
 */
export const Button = ({
  variant = 'primary',
  fullWidth = false,
  className,
  type = 'button',
  onClick,
  children,
  ...props
}: Props) => {
  const [ripples, setRipples] = useState<RipplePoint[]>([]);

  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    const rect = event.currentTarget.getBoundingClientRect();
    setRipples((current) => [
      ...current,
      {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        id: event.timeStamp,
      },
    ]);
    window.setTimeout(() => {
      setRipples((current) => current.slice(1));
    }, 520);
    onClick?.(event);
  };

  return (
    <button
      type={type}
      className={cx(styles.root, variants[variant], fullWidth && styles.full, className)}
      onClick={handleClick}
      {...props}
    >
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className={styles.ripple}
          style={{ left: `${ripple.x}px`, top: `${ripple.y}px` }}
        />
      ))}
    </button>
  );
};
