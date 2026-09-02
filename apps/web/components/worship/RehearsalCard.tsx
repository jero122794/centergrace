// apps/web/components/worship/RehearsalCard.tsx
import { Calendar, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { formatDateTimeBogota } from '@/lib/formatters';

interface Props {
  date: string;
  location?: string;
  ready?: boolean;
}

/**
 * Upcoming rehearsal summary for the worship module.
 */
export const RehearsalCard = ({ date, location, ready }: Props) => (
  <Card>
    <p className="inline-flex items-center gap-2 font-display text-lg text-dark">
      <Calendar className="h-4 w-4 text-worship" aria-hidden />
      {formatDateTimeBogota(date)}
    </p>
    {location ? (
      <p className="mt-1 inline-flex items-center gap-1 text-[13px] text-muted">
        <MapPin className="h-3.5 w-3.5" aria-hidden />
        {location}
      </p>
    ) : null}
    {ready ? <p className="mt-3 text-xs font-medium text-success-d">Lista para el servicio</p> : null}
  </Card>
);
