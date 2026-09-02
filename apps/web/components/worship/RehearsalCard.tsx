// apps/web/components/worship/RehearsalCard.tsx
import { Calendar, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { formatDateTimeBogota } from '@/lib/formatters';
import styles from './RehearsalCard.module.css';

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
    <p className={styles.date}>
      <Calendar className={styles.icon} aria-hidden />
      {formatDateTimeBogota(date)}
    </p>
    {location ? (
      <p className={styles.place}>
        <MapPin className={styles.icon} aria-hidden />
        {location}
      </p>
    ) : null}
    {ready ? <p className={styles.ready}>Lista para el servicio</p> : null}
  </Card>
);
