// apps/web/components/developer/JobMonitor.tsx
'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDateTimeBogota } from '@/lib/formatters';

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
  <div className="grid gap-4 md:grid-cols-2">
    {jobs.map((job) => (
      <article key={job.name} className="rounded-xl border border-dev/30 bg-dev-l p-[18px]">
        <p className="font-mono text-sm font-semibold text-dark">{job.name}</p>
        <p className="mt-1 font-mono text-xs text-muted">{job.expression}</p>
        <p className="mt-2 font-mono text-xs text-muted">
          {job.lastRun
            ? `${formatDateTimeBogota(job.lastRun.startedAt)} · ${job.lastRun.durationMs} ms`
            : 'Sin ejecuciones'}
        </p>
        <div className="mt-3 flex items-center justify-between">
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
