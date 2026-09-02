// apps/web/components/ui/PageHeader.tsx
import type { ReactNode } from 'react';
import { Ornament } from '@/components/brand/Ornament';
import styles from './PageHeader.module.css';

interface Props {
  kicker?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

/**
 * Editorial page title with a botanical rule.
 */
export const PageHeader = ({ kicker, title, description, action }: Props) => (
  <div className={styles.row}>
    <div className={styles.copy}>
      {kicker ? <p className={styles.kicker}>{kicker}</p> : null}
      <h1 className={styles.title}>{title}</h1>
      {description ? <p className={styles.description}>{description}</p> : null}
      <Ornament className={styles.rule} />
    </div>
    {action ? <div className={styles.action}>{action}</div> : null}
  </div>
);
