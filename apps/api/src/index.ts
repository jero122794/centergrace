// apps/api/src/index.ts
import { env } from './shared/config/env';
import { logger } from './shared/utils/logger';
import { redis } from './shared/config/redis';
import { prisma } from './shared/config/prisma';
import { createApp } from './app';
import { jobRegistry } from './jobs/job-registry';

const start = async (): Promise<void> => {
  await redis.connect().catch(() => undefined);
  await prisma.$connect();
  jobRegistry.start();
  const app = createApp();
  app.listen(env.PORT, '0.0.0.0', () => {
    logger.info(`API listening on port ${env.PORT}`);
  });
};

void start().catch((error: unknown) => {
  logger.error('Fatal boot error', {
    message: error instanceof Error ? error.message : 'unknown',
  });
  process.exit(1);
});
