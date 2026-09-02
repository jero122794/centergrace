// apps/api/src/shared/config/env.ts
import { existsSync } from 'fs';
import { resolve } from 'path';
import dotenv from 'dotenv';
import { z } from 'zod';

const envCandidates = [resolve(process.cwd(), '.env'), resolve(process.cwd(), '../../.env')];
for (const file of envCandidates) {
  if (existsSync(file)) {
    dotenv.config({ path: file });
    break;
  }
}

const optionalSecret = z.string().default('');

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3001),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  REDIS_URL: z.string().min(1, 'REDIS_URL is required'),
  JWT_PRIVATE_KEY: z.string().min(1, 'JWT_PRIVATE_KEY is required'),
  JWT_PUBLIC_KEY: z.string().min(1, 'JWT_PUBLIC_KEY is required'),
  JWT_REFRESH_SECRET: z.string().min(16, 'JWT_REFRESH_SECRET must be at least 16 characters'),
  FRONTEND_URL: z.string().url(),
  VAPID_PUBLIC_KEY: z.string().min(1),
  VAPID_PRIVATE_KEY: z.string().min(1),
  VAPID_SUBJECT: z.string().min(1),
  AWS_ACCESS_KEY_ID: optionalSecret,
  AWS_SECRET_ACCESS_KEY: optionalSecret,
  AWS_REGION: z.string().default('us-east-1'),
  AWS_S3_BUCKET: optionalSecret,
  AWS_SES_FROM: optionalSecret,
  GOOGLE_CLIENT_ID: optionalSecret,
  GOOGLE_CLIENT_SECRET: optionalSecret,
  GOOGLE_CALLBACK_URL: z.string().url().optional(),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

export type AppEnv = z.infer<typeof envSchema>;

const PRODUCTION_REQUIRED: Array<keyof AppEnv> = [
  'JWT_PRIVATE_KEY',
  'JWT_PUBLIC_KEY',
  'JWT_REFRESH_SECRET',
  'DATABASE_URL',
  'REDIS_URL',
  'VAPID_PUBLIC_KEY',
  'VAPID_PRIVATE_KEY',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'AWS_S3_BUCKET',
  'AWS_SES_FROM',
];

const restorePem = (value: string): string => value.replace(/\\n/g, '\n');

/**
 * Validates process environment at boot. Fails fast with a clear message.
 */
export const loadEnv = (): AppEnv => {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const details = parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
    throw new Error(`Invalid environment variables:\n${details.join('\n')}`);
  }
  const env = parsed.data;
  if (env.NODE_ENV === 'production') {
    assertProductionSecrets(env);
  }
  return {
    ...env,
    JWT_PRIVATE_KEY: restorePem(env.JWT_PRIVATE_KEY),
    JWT_PUBLIC_KEY: restorePem(env.JWT_PUBLIC_KEY),
  };
};

const assertProductionSecrets = (env: AppEnv): void => {
  const missing = PRODUCTION_REQUIRED.filter((key) => {
    const value = env[key];
    return typeof value !== 'string' || value.length === 0;
  });
  if (missing.length > 0) {
    throw new Error(`Missing required production environment variables: ${missing.join(', ')}`);
  }
};

export const env: AppEnv = loadEnv();
