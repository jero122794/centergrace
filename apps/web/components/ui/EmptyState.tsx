// apps/web/components/ui/EmptyState.tsx
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Ornament } from '@/components/brand/Ornament';

interface Props {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: ReactNode;
}

/**
 * Quiet empty collection, without a dashed SaaS box.
 */
export const EmptyState = ({ title, description, action }: Props) => (
  <div className="px-4 py-14 text-center">
    <Ornament className="mx-auto max-w-xs" />
    <h2 className="mt-5 font-display text-2xl text-dark">{title}</h2>
    <p className="mx-auto mt-2 max-w-sm text-[15px] leading-relaxed text-muted">{description}</p>
    {action ? <div className="mt-5">{action}</div> : null}
  </div>
);
