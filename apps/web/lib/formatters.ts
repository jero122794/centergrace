// apps/web/lib/formatters.ts
import { es } from 'date-fns/locale';
import { formatInTimeZone } from 'date-fns-tz';

const BOGOTA = 'America/Bogota';

export const formatDateBogota = (value: string | Date): string => {
  return formatInTimeZone(value, BOGOTA, 'dd/MM/yyyy');
};

export const formatGreetingDate = (value: Date): string => {
  const raw = formatInTimeZone(value, BOGOTA, "EEEE d 'de' MMMM", { locale: es });
  return raw.charAt(0).toUpperCase() + raw.slice(1);
};

export const formatGreeting = (value: Date): string => {
  const hour = Number(formatInTimeZone(value, BOGOTA, 'H'));
  if (hour < 12) {
    return 'Buenos días';
  }
  if (hour < 19) {
    return 'Buenas tardes';
  }
  return 'Buenas noches';
};

export const formatLongDateBogota = (value: Date | string): string => {
  const raw = formatInTimeZone(value, BOGOTA, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });
  return raw.charAt(0).toUpperCase() + raw.slice(1);
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
