import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    env: {
      NODE_ENV: 'test',
      PORT: '3001',
      DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/platform_db',
      REDIS_URL: 'redis://localhost:6379',
      JWT_PRIVATE_KEY: 'test-private',
      JWT_PUBLIC_KEY: 'test-public',
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
