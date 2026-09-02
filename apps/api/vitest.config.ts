import { defineConfig } from 'vitest/config';
import { TEST_JWT_PRIVATE_KEY, TEST_JWT_PUBLIC_KEY } from './src/test/jwt-test-keys';

const TEST_DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/platform_test';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    fileParallelism: false,
    globalSetup: ['./src/test/global-setup.ts'],
    env: {
      NODE_ENV: 'test',
      PORT: '3001',
      DATABASE_URL: TEST_DATABASE_URL,
      REDIS_URL: 'redis://localhost:6379',
      JWT_PRIVATE_KEY: TEST_JWT_PRIVATE_KEY,
      JWT_PUBLIC_KEY: TEST_JWT_PUBLIC_KEY,
      JWT_REFRESH_SECRET: 'test-refresh-secret-16',
      FRONTEND_URL: 'http://localhost:3000',
      VAPID_PUBLIC_KEY: 'test-vapid-public',
      VAPID_PRIVATE_KEY: 'test-vapid-private',
      VAPID_SUBJECT: 'mailto:dev@localhost',
      AWS_ACCESS_KEY_ID: '',
      AWS_SECRET_ACCESS_KEY: '',
      AWS_S3_BUCKET: '',
      AWS_SES_FROM: '',
    },
  },
});
