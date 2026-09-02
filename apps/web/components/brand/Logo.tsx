// apps/web/components/brand/Logo.tsx
import { cn } from '@/lib/cn';

interface Props {
  className?: string;
  compact?: boolean;
}

/**
 * Centro de Gracia wordmark with an oval olive mark.
 */
export const Logo = ({ className, compact = false }: Props) => (
  <div className={cn('flex items-center gap-3', className)}>
    <span
      className="inline-flex h-11 w-10 items-center justify-center text-warm"
      style={{
        background: 'var(--color-accent)',
        borderRadius: '58% 42% 50% 50% / 42% 48% 52% 58%',
      }}
    >
      <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" aria-hidden>
        <path
          d="M16 5.5c3.1 3.6 4.6 7.1 4.6 10.2 0 3.6-1.9 6.5-4.6 8.4-2.7-1.9-4.6-4.8-4.6-8.4 0-3.1 1.5-6.6 4.6-10.2Z"
          fill="currentColor"
        />
        <path
          d="M7.5 19c3.8.15 6.6 1.9 8.5 4.8 1.9-2.9 4.7-4.65 8.5-4.8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </span>
    {compact ? null : (
      <span className="leading-tight">
        <span className="block font-display text-[1.15rem] tracking-tight text-dark">Centro de Gracia</span>
        <span className="block text-[10px] uppercase tracking-[0.22em] text-muted">Centro Misionero Shalom</span>
      </span>
    )}
  </div>
);
