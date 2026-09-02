// apps/api/src/shared/utils/http.ts
import type { Response } from 'express';

/**
 * Sends the platform success envelope.
 */
export const sendSuccess = <T>(res: Response, data: T, statusCode = 200, message?: string): void => {
  res.status(statusCode).json({ data, message });
};

/**
 * Sends a paginated list envelope.
 */
export const sendPaginated = <T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  limit: number,
): void => {
  res.status(200).json({ data, total, page, limit });
};
