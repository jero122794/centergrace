// apps/api/src/shared/config/redis.ts
import Redis from 'ioredis';
import { env } from './env';
import { logger } from '../utils/logger';

const globalForRedis = globalThis as unknown as { redis?: Redis };

/**
 * Singleton Redis connection used for cache, rate limiting and jobs.
 */
export const redis =
  globalForRedis.redis ??
  new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    lazyConnect: true,
  });

redis.on('error', (error: Error) => {
  logger.error('Redis connection error', { context: 'redis', message: error.message });
});

if (env.NODE_ENV !== 'production') {
  globalForRedis.redis = redis;
}

/**
 * Verifies Redis connectivity with a PING command.
 */
export const pingRedis = async (): Promise<boolean> => {
  const result = await redis.ping();
  return result === 'PONG';
};
