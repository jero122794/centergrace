// apps/api/src/shared/utils/async-handler.ts
import type { NextFunction, Request, Response } from 'express';

type AsyncRoute = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

/**
 * Wraps async Express handlers so rejected promises reach the error middleware.
 */
export const asyncHandler =
  (handler: AsyncRoute) =>
  (req: Request, res: Response, next: NextFunction): void => {
    void handler(req, res, next).catch(next);
  };
