// apps/web/components/ui/Skeleton.tsx
import { cn } from '@/lib/cn';

interface Props {
  className?: string;
  lines?: number;
}

/**
 * Shimmer placeholder while content loads.
 *
 * @example
 * <Skeleton lines={3} />
 */
export const Skeleton = ({ className = 'h-24', lines }: Props) => {
  const bar = (key: number) => (
    <div
      key={key}
      className={cn(
        'bg-[linear-gradient(90deg,var(--color-surface)_0%,#fff_50%,var(--color-surface)_100%)] bg-[length:200%_100%] animate-shimmer',
        lines ? 'h-16' : className,
      )}
      style={{ borderRadius: '8px 28px 14px 22px' }}
    />
  );
  if (lines) {
    return <div className="space-y-3">{Array.from({ length: lines }).map((_, index) => bar(index))}</div>;
  }
  return bar(0);
};
