// packages/utils/src/formatters.ts
const BOGOTA_TIME_ZONE = "America/Bogota";
const DATE_DISPLAY_FORMAT: Intl.DateTimeFormatOptions = {
  timeZone: BOGOTA_TIME_ZONE,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
};

/**
 * Formats a UTC date as dd/MM/yyyy in America/Bogota.
 */
export const formatDateBogota = (value: Date | string): string => {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("es-CO", DATE_DISPLAY_FORMAT).format(date);
};

/**
 * Formats an integer COP amount using Colombian grouping.
 */
export const formatCop = (pesos: number): string => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(pesos);
};
