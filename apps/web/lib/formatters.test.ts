import { describe, expect, it } from 'vitest';
import { formatDateBogota, formatDateTimeBogota, formatGreetingDate, resolveMediaUrl } from './formatters';

describe('formatters', () => {
  const instant = new Date('2026-09-02T15:00:00.000Z');

  it('formats dates in America/Bogota', () => {
    expect(formatDateBogota(instant)).toBe('02/09/2026');
    expect(formatDateTimeBogota(instant)).toBe('02/09/2026 10:00');
  });

  it('formats a Spanish greeting date', () => {
    expect(formatGreetingDate(instant)).toBe('Miércoles 2 de septiembre');
  });

  it('resolves relative media URLs against the API', () => {
    expect(resolveMediaUrl('/uploads/photo.jpg')).toContain('/uploads/photo.jpg');
    expect(resolveMediaUrl('https://cdn.example.com/a.png')).toBe('https://cdn.example.com/a.png');
  });
});
