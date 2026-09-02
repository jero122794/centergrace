// apps/api/src/shared/middleware/validate.middleware.ts
import type { NextFunction, Request, Response } from 'express';
import type { AnyZodObject, ZodEffects, ZodTypeAny } from 'zod';

type SchemaMap = {
  body?: ZodTypeAny;
  params?: ZodTypeAny;
  query?: ZodTypeAny;
  headers?: ZodTypeAny;
};

/**
 * Validates request slices with Zod before the controller runs.
 */
export const validate =
  (schemas: SchemaMap) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      if (schemas.params) {
        req.params = schemas.params.parse(req.params) as typeof req.params;
      }
      if (schemas.query) {
        req.query = schemas.query.parse(req.query) as typeof req.query;
      }
      if (schemas.headers) {
        schemas.headers.parse(req.headers);
      }
      next();
    } catch (error) {
      next(error);
    }
  };

export type ZodObjectLike = AnyZodObject | ZodEffects<AnyZodObject>;
