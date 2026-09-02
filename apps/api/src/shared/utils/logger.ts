// apps/api/src/shared/utils/logger.ts
import winston from 'winston';
import { env } from '../config/env';

const SENSITIVE_KEYS = new Set([
  'password',
  'passwordHash',
  'token',
  'accessToken',
  'refreshToken',
  'authorization',
  'cookie',
  'secret',
  'privateKey',
]);

const redact = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(redact);
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, entry]) => [
        key,
        SENSITIVE_KEYS.has(key) ? '[REDACTED]' : redact(entry),
      ]),
    );
  }
  return value;
};

/**
 * Structured logger. Production emits JSON; development uses a readable format.
 */
export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf((info) => {
      const safe = redact(info) as Record<string, unknown>;
      if (env.NODE_ENV === 'production') {
        return JSON.stringify(safe);
      }
      return `${String(safe.timestamp)} [${String(safe.level)}] ${String(safe.message)}`;
    }),
  ),
  transports: [new winston.transports.Console()],
});
