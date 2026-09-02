// apps/web/components/ui/EmptyState.tsx
import type { ReactNode } from 'react';
import { Icon, type IconName } from './Icon';

interface Props {
  title: string;
  description: string;
  icon?: IconName;
  action?: ReactNode;
}

export const EmptyState = ({ title, description, icon = 'spark', action }: Props) => (
  <div className="rounded-3xl border border-dashed border-teal/20 bg-surface/70 px-6 py-12 text-center">
    <span className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-mist text-teal">
      <Icon name={icon} />
    </span>
    <h2 className="font-display text-xl text-teal">{title}</h2>
    <p className="mx-auto mt-2 max-w-md text-sm text-ink/60">{description}</p>
    {action ? <div className="mt-4">{action}</div> : null}
  </div>
);
