// apps/api/src/shared/middleware/error.middleware.ts
import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { env } from '../config/env';
import { AppError } from '../utils/app-error';
import { logger } from '../utils/logger';

/**
 * Global Express error handler. Never leaks stack traces in production.
 */
export const errorMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      statusCode: err.statusCode,
      error: err.error,
      message: err.message,
      details: err.details,
    });
    return;
  }
  if (err instanceof ZodError) {
    res.status(400).json({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Validation failed',
      details: err.flatten(),
    });
    return;
  }
  logger.error('Unhandled error', {
    message: err instanceof Error ? err.message : 'Unknown error',
    context: 'error-middleware',
  });
  res.status(500).json({
    statusCode: 500,
    error: 'Internal Server Error',
    message: env.NODE_ENV === 'production' ? 'An unexpected error occurred' : stringifyUnknown(err),
  });
};

const stringifyUnknown = (err: unknown): string => {
  if (err instanceof Error) {
    return err.message;
  }
  return 'Unknown error';
};
