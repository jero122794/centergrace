// apps/web/components/ui/PageHeader.tsx
import type { ReactNode } from 'react';

interface Props {
  kicker?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export const PageHeader = ({ kicker, title, description, action }: Props) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div>
      {kicker ? <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-dark">{kicker}</p> : null}
      <h1 className="font-display text-3xl text-teal md:text-4xl">{title}</h1>
      {description ? <p className="mt-1 max-w-2xl text-sm text-ink/60">{description}</p> : null}
    </div>
    {action ? <div className="shrink-0">{action}</div> : null}
  </div>
);
