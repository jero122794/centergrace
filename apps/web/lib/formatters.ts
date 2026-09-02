// apps/web/lib/formatters.ts
import { formatInTimeZone } from 'date-fns-tz';

const BOGOTA = 'America/Bogota';

export const formatDateBogota = (value: string | Date): string => {
  return formatInTimeZone(value, BOGOTA, 'dd/MM/yyyy');
};

export const formatDateTimeBogota = (value: string | Date): string => {
  return formatInTimeZone(value, BOGOTA, 'dd/MM/yyyy HH:mm');
};
