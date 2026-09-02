// apps/web/components/layout/AuthShell.tsx
import type { ReactNode } from 'react';
import { Logo } from '@/components/brand/Logo';
import { Ornament } from '@/components/brand/Ornament';
import styles from './AuthShell.module.css';

interface Props {
  title: string;
  subtitle: string;
  children: ReactNode;
}

/**
 * First-contact stage: dusk-moss field, paper card. Used for password and similar flows.
 */
export const AuthShell = ({ title, subtitle, children }: Props) => (
  <main className={styles.stage}>
    <div className={styles.card}>
      <Logo className={styles.logo} />
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.subtitle}>{subtitle}</p>
      <Ornament className={styles.rule} />
      {children}
    </div>
  </main>
);
