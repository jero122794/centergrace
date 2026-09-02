// apps/web/components/developer/LogViewer.tsx
'use client';

import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { formatDateTimeBogota } from '@/lib/formatters';
import { cn } from '@/lib/cn';

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
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end">
        <div className="flex gap-2">
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
        <div className="flex-1">
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
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left text-[13px]">
          <thead className="bg-dev-l font-mono text-[10px] uppercase tracking-wide text-dev">
            <tr>
              <th className="px-3 py-2">Timestamp</th>
              <th className="px-3 py-2">Nivel</th>
              <th className="px-3 py-2">Mensaje</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((item, index) => (
              <tr key={item.id} className={cn(index % 2 === 0 ? 'bg-bg' : 'bg-paper')}>
                <td className="whitespace-nowrap px-3 py-2 font-mono text-muted">{formatDateTimeBogota(item.createdAt)}</td>
                <td className="px-3 py-2">
                  <Badge tone={levelTone(item.level)}>{item.level}</Badge>
                </td>
                <td className="px-3 py-2 font-mono text-dark">{item.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
