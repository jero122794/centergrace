// apps/web/components/ui/Alert.tsx
import type { ReactNode } from 'react';
import { cx } from '@/lib/cn';
import styles from './Alert.module.css';

interface Props {
  children: ReactNode;
  tone?: 'danger' | 'info' | 'success';
}

const tones: Record<NonNullable<Props['tone']>, string> = {
  danger: styles.danger,
  info: styles.info,
  success: styles.success,
};

/**
 * Inline status banner for forms and pages.
 */
export const Alert = ({ children, tone = 'danger' }: Props) => (
  <p role="alert" className={cx(styles.banner, tones[tone])}>
    {children}
  </p>
);
