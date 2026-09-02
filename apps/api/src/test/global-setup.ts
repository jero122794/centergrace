// apps/api/src/test/global-setup.ts
import { execSync } from 'child_process';
import { TEST_JWT_PRIVATE_KEY, TEST_JWT_PUBLIC_KEY } from './jwt-test-keys';

const TEST_DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/platform_test';

/**
 * Applies Prisma migrations to the isolated test database before the suite runs.
 */
const setup = async (): Promise<void> => {
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = TEST_DATABASE_URL;
  process.env.JWT_PRIVATE_KEY = TEST_JWT_PRIVATE_KEY;
  process.env.JWT_PUBLIC_KEY = TEST_JWT_PUBLIC_KEY;
  process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-16';
  process.env.FRONTEND_URL = 'http://localhost:3000';
  process.env.REDIS_URL = process.env.REDIS_URL ?? 'redis://localhost:6379';
  process.env.VAPID_PUBLIC_KEY = 'test-vapid-public';
  process.env.VAPID_PRIVATE_KEY = 'test-vapid-private';
  process.env.VAPID_SUBJECT = 'mailto:dev@localhost';
  execSync('npx prisma migrate deploy', { stdio: 'inherit', env: process.env as NodeJS.ProcessEnv });
};

export default setup;
