// apps/web/components/ui/EmptyState.tsx
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Sparkles } from 'lucide-react';

interface Props {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: ReactNode;
}

/**
 * Centered empty-collection message.
 *
 * @example
 * <EmptyState title="Sin avisos" description="Cuando haya mensajes, aparecerán aquí." />
 */
export const EmptyState = ({ title, description, icon: Icon = Sparkles, action }: Props) => (
  <div className="rounded-2xl border border-dashed border-primary/60 bg-paper px-6 py-12 text-center">
    <Icon className="mx-auto mb-3 h-12 w-12 text-primary" aria-hidden />
    <h2 className="font-display text-lg text-dark">{title}</h2>
    <p className="mx-auto mt-2 max-w-xs text-sm text-muted">{description}</p>
    {action ? <div className="mt-4">{action}</div> : null}
  </div>
);
