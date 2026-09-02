// apps/web/components/ui/EmptyState.tsx
import type { LucideIcon } from 'lucide-react';
import { Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';
import styles from './EmptyState.module.css';

interface Props {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: ReactNode;
}

/**
 * Quiet empty collection. The central mark floats — “I am here, waiting.”
 *
 * @param icon Optional Lucide icon; defaults to a spark for spiritual emptiness.
 */
export const EmptyState = ({ title, description, icon: Icon = Sparkles, action }: Props) => (
  <div className={styles.wrap}>
    <div className={styles.mark} aria-hidden>
      <Icon className={styles.glyph} />
    </div>
    <h2 className={styles.title}>{title}</h2>
    <p className={styles.body}>{description}</p>
    {action ? <div className={styles.action}>{action}</div> : null}
  </div>
);
