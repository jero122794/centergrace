// apps/web/components/developer/LogViewer.tsx
'use client';

import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { formatDateTimeBogota } from '@/lib/formatters';
import { cx } from '@/lib/cn';
import styles from './LogViewer.module.css';

export interface SystemLogRow {
  id: string;
  level: string;
  message: string;
  context?: string | null;
  createdAt: string;
}

interface Props {
  logs: SystemLogRow[];
  autoRefresh: boolean;
  onToggleRefresh: () => void;
  onFilter: (values: { level?: string; search?: string }) => void;
}

const levelTone = (level: string): 'info' | 'warning' | 'danger' | 'neutral' => {
  if (level === 'error') {
    return 'danger';
  }
  if (level === 'warn') {
    return 'warning';
  }
  if (level === 'info') {
    return 'info';
  }
  return 'neutral';
};

/**
 * Filterable system log table for the developer panel.
 */
export const LogViewer = ({ logs, autoRefresh, onToggleRefresh, onFilter }: Props) => {
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState<string | undefined>();
  const levels = useMemo(() => ['info', 'warn', 'error'] as const, []);

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <div className={styles.levels}>
          {levels.map((item) => (
            <Button
              key={item}
              variant={level === item ? 'primary' : 'secondary'}
              onClick={() => {
                const next = level === item ? undefined : item;
                setLevel(next);
                onFilter({ level: next, search });
              }}
            >
              {item}
            </Button>
          ))}
        </div>
        <div className={styles.search}>
          <Input
            label="Buscar"
            value={search}
            onChange={(event) => {
              const next = event.target.value;
              setSearch(next);
              onFilter({ level, search: next });
            }}
            placeholder="Mensaje o contexto"
          />
        </div>
        <Button variant={autoRefresh ? 'primary' : 'secondary'} onClick={onToggleRefresh}>
          Auto 30s: {autoRefresh ? 'on' : 'off'}
        </Button>
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead className={styles.head}>
            <tr>
              <th className={styles.cell}>Timestamp</th>
              <th className={styles.cell}>Nivel</th>
              <th className={styles.cell}>Mensaje</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((item, index) => (
              <tr key={item.id} className={index % 2 === 0 ? styles.odd : styles.even}>
                <td className={cx(styles.cell, styles.time)}>{formatDateTimeBogota(item.createdAt)}</td>
                <td className={styles.cell}>
                  <Badge tone={levelTone(item.level)}>{item.level}</Badge>
                </td>
                <td className={cx(styles.cell, styles.msg)}>{item.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
