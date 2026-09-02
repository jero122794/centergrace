// apps/web/components/dashboard/StatCard.tsx
import type { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/cn';

interface Props {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  accent?: 'accent' | 'gold' | 'success' | 'danger' | 'worship' | 'dev';
}

const accents: Record<NonNullable<Props['accent']>, string> = {
  accent: 'border-t-accent',
  gold: 'border-t-gold-d',
  success: 'border-t-success-d',
  danger: 'border-t-danger-d',
  worship: 'border-t-worship',
  dev: 'border-t-dev',
};

/**
 * Metric tile for dashboards.
 *
 * @example
 * <StatCard label="Cursos" value={3} />
 */
export const StatCard = ({ label, value, icon: Icon, accent = 'accent' }: Props) => (
  <Card className={cn('border-t-[3px] p-5', accents[accent])}>
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
        <p className="mt-2 font-display text-[32px] font-bold leading-none text-dark">{value}</p>
      </div>
      {Icon ? (
        <span className="rounded-lg bg-surface p-2 text-accent">
          <Icon className="h-6 w-6" aria-hidden />
        </span>
      ) : null}
    </div>
  </Card>
);
