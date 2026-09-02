// apps/api/src/shared/middleware/rate-limit.middleware.ts
import type { RequestHandler } from 'express';
import rateLimit from 'express-rate-limit';
import RedisStore, { type RedisReply } from 'rate-limit-redis';
import {
  AUTH_RATE_LIMIT_MAX,
  AUTH_RATE_LIMIT_WINDOW_MS,
  GENERAL_RATE_LIMIT_MAX,
  GENERAL_RATE_LIMIT_WINDOW_MS,
  UPLOAD_RATE_LIMIT_MAX,
  UPLOAD_RATE_LIMIT_WINDOW_MS,
} from '../config/constants';
import { env } from '../config/env';
import { redis } from '../config/redis';

const passthrough: RequestHandler = (_req, _res, next) => next();

const redisStore = (prefix: string): RedisStore =>
  new RedisStore({
    sendCommand: ((...args: string[]) => redis.call(...(args as [string, ...string[]]))) as (
      ...args: string[]
    ) => Promise<RedisReply>,
    prefix,
  });

const storeFor = (prefix: string): { store?: RedisStore } =>
  env.NODE_ENV === 'test' ? {} : { store: redisStore(prefix) };

export const authLimiter: RequestHandler =
  env.NODE_ENV === 'test'
    ? passthrough
    : rateLimit({
        windowMs: AUTH_RATE_LIMIT_WINDOW_MS,
        max: AUTH_RATE_LIMIT_MAX,
        standardHeaders: true,
        legacyHeaders: false,
        ...storeFor('rl:auth:'),
        message: {
          statusCode: 429,
          error: 'Too Many Requests',
          message: 'Too many authentication attempts. Try again later.',
        },
      });

export const generalLimiter: RequestHandler =
  env.NODE_ENV === 'test'
    ? passthrough
    : rateLimit({
        windowMs: GENERAL_RATE_LIMIT_WINDOW_MS,
        max: GENERAL_RATE_LIMIT_MAX,
        standardHeaders: true,
        legacyHeaders: false,
        ...storeFor('rl:general:'),
      });

export const uploadLimiter: RequestHandler =
  env.NODE_ENV === 'test'
    ? passthrough
    : rateLimit({
        windowMs: UPLOAD_RATE_LIMIT_WINDOW_MS,
        max: UPLOAD_RATE_LIMIT_MAX,
        standardHeaders: true,
        legacyHeaders: false,
        keyGenerator: (req) => {
          const userId = (req as { user?: { sub?: string } }).user?.sub;
          return userId ?? req.ip ?? 'anonymous';
        },
        ...storeFor('rl:upload:'),
      });
