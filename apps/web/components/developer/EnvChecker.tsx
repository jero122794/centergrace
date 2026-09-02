// apps/web/components/developer/EnvChecker.tsx
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import styles from './EnvChecker.module.css';

export interface EnvFlag {
  key: string;
  present: boolean;
}

interface Props {
  items: EnvFlag[];
}

/**
 * Presence-only environment checklist. Values are never rendered.
 */
export const EnvChecker = ({ items }: Props) => (
  <div className={styles.wrap}>
    <Alert tone="info">Los valores nunca se muestran por seguridad.</Alert>
    <ul className={styles.list}>
      {items.map((item) => (
        <li key={item.key} className={styles.row}>
          <p className={styles.key}>{item.key}</p>
          <Badge tone={item.present ? 'success' : 'danger'}>{item.present ? 'Definida' : 'Ausente'}</Badge>
        </li>
      ))}
    </ul>
  </div>
);
