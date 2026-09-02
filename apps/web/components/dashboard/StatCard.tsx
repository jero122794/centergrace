// apps/web/components/dashboard/StatCard.tsx
import type { LucideIcon } from 'lucide-react';

interface Props {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  accent?: 'accent' | 'gold' | 'success' | 'danger' | 'worship' | 'dev';
}

/**
 * Typographic metric on a ledger line — not a boxed KPI tile.
 */
export const StatCard = ({ label, value, icon: Icon }: Props) => (
  <div className="ledger-item">
    <dt className="flex items-center gap-2">
      {Icon ? <Icon className="h-3.5 w-3.5" aria-hidden /> : null}
      {label}
    </dt>
    <dd>{value}</dd>
  </div>
);
