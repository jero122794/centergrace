// apps/web/components/worship/RehearsalCard.tsx
import { Card } from '@/components/ui/Card';
import { formatDateTimeBogota } from '@/lib/formatters';

interface Props {
  date: string;
  location?: string;
}

export const RehearsalCard = ({ date, location }: Props) => (
  <Card>
    <p>{formatDateTimeBogota(date)}</p>
    <p className="text-sm text-slate-500">{location}</p>
  </Card>
);
