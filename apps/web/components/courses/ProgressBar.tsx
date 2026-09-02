// apps/web/components/courses/ProgressBar.tsx
import { cn } from '@/lib/cn';

interface Props {
  percent: number;
  className?: string;
}

/**
 * Course or lesson completion track.
 */
export const ProgressBar = ({ percent, className }: Props) => {
  const value = Math.min(100, Math.max(0, percent));
  const done = value >= 100;
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="h-1.5 flex-1 overflow-hidden rounded-[3px] bg-border">
        <div
          className={cn('h-full rounded-[3px] transition-[width] duration-700 ease-out', done ? 'bg-success-d' : 'bg-primary-d')}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-accent">{value}%</span>
    </div>
  );
};
