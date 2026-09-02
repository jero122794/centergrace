// apps/web/components/brand/Logo.tsx
import { cn } from '@/lib/cn';

interface Props {
  className?: string;
  compact?: boolean;
}

/**
 * Centro de Gracia wordmark with olive-leaf mark.
 */
export const Logo = ({ className, compact = false }: Props) => (
  <div className={cn('flex items-center gap-3', className)}>
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-accent text-warm">
      <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" aria-hidden>
        <path
          d="M16 6c2.8 3.2 4.2 6.4 4.2 9.2 0 3.4-1.8 6.2-4.2 8-2.4-1.8-4.2-4.6-4.2-8C11.8 12.4 13.2 9.2 16 6Z"
          fill="currentColor"
        />
        <path d="M8 18.5c3.4.2 6 1.8 8 4.5 2-2.7 4.6-4.3 8-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </span>
    {compact ? null : (
      <span className="leading-tight">
        <span className="block font-display text-lg text-dark">Centro de Gracia</span>
        <span className="block text-[11px] uppercase tracking-[0.16em] text-muted">Centro Misionero Shalom</span>
      </span>
    )}
  </div>
);
