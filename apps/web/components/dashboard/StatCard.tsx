// apps/web/components/dashboard/StatCard.tsx
import { Card } from '@/components/ui/Card';
import { Icon, type IconName } from '@/components/ui/Icon';

interface Props {
  label: string;
  value: string | number;
  icon?: IconName;
}

export const StatCard = ({ label, value, icon }: Props) => (
  <Card className="relative overflow-hidden">
    {icon ? (
      <span className="absolute right-4 top-4 text-teal/20">
        <Icon name={icon} className="h-8 w-8" />
      </span>
    ) : null}
    <p className="text-sm text-ink/55">{label}</p>
    <p className="mt-2 font-display text-3xl text-teal">{value}</p>
  </Card>
);
