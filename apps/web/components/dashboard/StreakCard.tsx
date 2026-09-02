// apps/web/components/dashboard/StreakCard.tsx
import { Flame } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/cn';

interface Props {
  days: number;
}

/**
 * Consecutive-activity streak with a seven-day dot trail.
 */
export const StreakCard = ({ days }: Props) => {
  const dots = Array.from({ length: 7 }, (_, index) => index >= 7 - Math.min(days, 7));
  return (
    <Card className="border-t-[3px] border-t-gold-d">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-display text-5xl font-bold text-accent">{days}</p>
          <p className="mt-1 text-[13px] text-muted">días consecutivos activos</p>
        </div>
        <Flame className="h-6 w-6 text-gold-d" aria-hidden />
      </div>
      <div className="mt-4 flex gap-2" aria-hidden>
        {dots.map((active, index) => (
          <span
            key={index}
            className={cn(
              'h-2.5 w-2.5 rounded-full',
              active ? 'bg-accent' : 'bg-border',
              index === 6 && 'box-border border-2 border-accent bg-paper',
            )}
          />
        ))}
      </div>
    </Card>
  );
};
