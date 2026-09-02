// apps/web/components/ui/PageHeader.tsx
import type { ReactNode } from 'react';

interface Props {
  kicker?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

/**
 * Page title block with optional kicker and action.
 */
export const PageHeader = ({ kicker, title, description, action }: Props) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div>
      {kicker ? <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-hint">{kicker}</p> : null}
      <h1 className="font-display text-h1 text-dark">{title}</h1>
      {description ? <p className="mt-1 max-w-2xl text-sm text-muted">{description}</p> : null}
    </div>
    {action ? <div className="shrink-0">{action}</div> : null}
  </div>
);
