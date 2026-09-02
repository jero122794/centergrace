// apps/web/components/dashboard/StatCard.tsx
import { Card } from '@/components/ui/Card';

interface Props {
  label: string;
  value: string | number;
}

export const StatCard = ({ label, value }: Props) => (
  <Card>
    <p className="text-sm text-slate-500">{label}</p>
    <p className="mt-2 font-display text-3xl text-teal">{value}</p>
  </Card>
);
