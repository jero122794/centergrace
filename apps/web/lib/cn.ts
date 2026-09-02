/**
 * Joins class names. No Tailwind merge — CSS Modules only.
 */
export const cx = (...parts: Array<string | number | false | null | undefined>): string =>
  parts.filter((part): part is string => typeof part === 'string' && part.length > 0).join(' ');

/** @deprecated alias kept for a few leftover call sites during migration */
export const cn = cx;
