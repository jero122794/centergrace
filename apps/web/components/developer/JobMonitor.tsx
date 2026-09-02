// apps/web/components/developer/JobMonitor.tsx
'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDateTimeBogota } from '@/lib/formatters';
import styles from './JobMonitor.module.css';

export interface JobStatus {
  name: string;
  expression: string;
  lastRun?: { startedAt: string; durationMs: number; status: string } | null;
}

interface Props {
  jobs: JobStatus[];
  runningName?: string | null;
  onTrigger: (name: string) => void;
}

/**
 * Cron job cards with a confirmed “run now” action.
 */
export const JobMonitor = ({ jobs, runningName, onTrigger }: Props) => (
  <div className={styles.grid}>
    {jobs.map((job) => (
      <article key={job.name} className={styles.card}>
        <p className={styles.name}>{job.name}</p>
        <p className={styles.meta}>{job.expression}</p>
        <p className={styles.meta}>
          {job.lastRun
            ? `${formatDateTimeBogota(job.lastRun.startedAt)} · ${job.lastRun.durationMs} ms`
            : 'Sin ejecuciones'}
        </p>
        <div className={styles.row}>
          <Badge tone={job.lastRun?.status === 'error' ? 'danger' : 'success'}>
            {job.lastRun?.status ?? 'idle'}
          </Badge>
          <Button
            variant="secondary"
            disabled={runningName === job.name}
            onClick={() => {
              if (window.confirm(`¿Ejecutar ahora ${job.name}?`)) {
                onTrigger(job.name);
              }
            }}
          >
            Ejecutar ahora
          </Button>
        </div>
      </article>
    ))}
  </div>
);
