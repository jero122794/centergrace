// apps/web/components/ui/PageHeader.tsx
import type { ReactNode } from 'react';
import { Ornament } from '@/components/brand/Ornament';

interface Props {
  kicker?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

/**
 * Editorial page title with a botanical rule.
 */
export const PageHeader = ({ kicker, title, description, action }: Props) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div className="max-w-2xl">
      {kicker ? <p className="text-[11px] uppercase tracking-[0.22em] text-gold-d">{kicker}</p> : null}
      <h1 className="mt-1 font-display text-[2.05rem] leading-[1.12] text-dark">{title}</h1>
      {description ? <p className="mt-2 text-[15px] leading-relaxed text-muted">{description}</p> : null}
      <Ornament className="mt-5 max-w-xs" />
    </div>
    {action ? <div className="shrink-0">{action}</div> : null}
  </div>
);
