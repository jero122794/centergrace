// apps/web/components/dashboard/ActivityHeatmap.tsx
import { cn } from '@/lib/cn';

interface Props {
  days: boolean[];
  label?: string;
}

/**
 * Seven-day activity dots. Pass newest day last.
 *
 * @example
 * <ActivityHeatmap days={[true, false, true, true, true, true, true]} />
 */
export const ActivityHeatmap = ({ days, label = 'Actividad de la semana' }: Props) => (
  <div>
    <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
    <div className="mt-3 flex gap-2" role="img" aria-label={label}>
      {days.map((active, index) => (
        <span
          key={index}
          className={cn(
            'h-2.5 w-2.5 rounded-full',
            active ? 'bg-accent' : 'bg-border',
            index === days.length - 1 && 'box-border border-2 border-accent',
          )}
        />
      ))}
    </div>
  </div>
);
