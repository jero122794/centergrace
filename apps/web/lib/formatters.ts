// apps/web/lib/formatters.ts
import { formatInTimeZone } from 'date-fns-tz';

const BOGOTA = 'America/Bogota';

export const formatDateBogota = (value: string | Date): string => {
  return formatInTimeZone(value, BOGOTA, 'dd/MM/yyyy');
};

export const formatDateTimeBogota = (value: string | Date): string => {
  return formatInTimeZone(value, BOGOTA, 'dd/MM/yyyy HH:mm');
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export const resolveMediaUrl = (url: string): string => {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `${API_URL}${url}`;
};
