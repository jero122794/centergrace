// apps/web/components/dashboard/StreakCard.tsx
import { cn } from '@/lib/cn';

interface Props {
  days: number;
}

/**
 * Consecutive-activity streak drawn as a warm ink blot, not a tile.
 */
export const StreakCard = ({ days }: Props) => {
  const dots = Array.from({ length: 7 }, (_, index) => index >= 7 - Math.min(days, 7));
  return (
    <div className="ledger-item">
      <dt>Días consecutivos</dt>
      <dd className="flex items-end gap-3">
        <span>{days}</span>
        <span className="mb-1 flex gap-1.5" aria-hidden>
          {dots.map((active, index) => (
            <span
              key={index}
              className={cn(
                'inline-block h-1.5 w-1.5 rounded-full',
                active ? 'bg-gold-d' : 'bg-border',
                index === 6 && 'h-2 w-2 bg-transparent ring-1 ring-accent',
              )}
            />
          ))}
        </span>
      </dd>
    </div>
  );
};
