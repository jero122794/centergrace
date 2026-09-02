// apps/web/components/developer/SystemMetricCard.tsx
import { cn } from '@/lib/cn';

interface Props {
  label: string;
  value: string | number;
  unit?: string;
  status?: 'ok' | 'warn' | 'crit';
  percent?: number;
}

const dots: Record<NonNullable<Props['status']>, string> = {
  ok: 'bg-[#22C55E]',
  warn: 'bg-[#F59E0B]',
  crit: 'bg-[#EF4444]',
};

/**
 * Technical metric tile for the developer panel.
 */
export const SystemMetricCard = ({ label, value, unit, status = 'ok', percent }: Props) => (
  <div className="rounded-xl border border-dev/30 bg-dev-l p-[18px]">
    <div className="flex items-center justify-between">
      <p className="font-mono text-[10px] uppercase tracking-wide text-dev">{label}</p>
      <span className={cn('h-2 w-2 rounded-full', dots[status])} />
    </div>
    <p className="mt-2 font-mono text-[28px] font-semibold text-dark">
      {value}
      {unit ? <span className="ml-1 text-xs font-normal text-muted">{unit}</span> : null}
    </p>
    {typeof percent === 'number' ? (
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-border">
        <div
          className={cn(
            'h-full',
            percent < 60 ? 'bg-success-d' : percent < 85 ? 'bg-warning-d' : 'bg-danger-d',
          )}
          style={{ width: `${Math.min(100, percent)}%` }}
        />
      </div>
    ) : null}
  </div>
);
