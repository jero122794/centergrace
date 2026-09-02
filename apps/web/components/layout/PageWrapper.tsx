// apps/web/components/layout/PageWrapper.tsx
import type { ReactNode } from 'react';
import { cx } from '@/lib/cn';
import styles from './PageWrapper.module.css';

interface Props {
  children: ReactNode;
  className?: string;
  wide?: boolean;
}

/**
 * Reading column. Rises on mount (page-rise).
 */
export const PageWrapper = ({ children, className, wide = false }: Props) => (
  <div className={cx(styles.wrap, wide && styles.wide, className)}>{children}</div>
);
