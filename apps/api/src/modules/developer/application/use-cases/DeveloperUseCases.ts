// apps/api/src/modules/developer/application/use-cases/DeveloperUseCases.ts
import os from 'os';
import { prisma } from '../../../../shared/config/prisma';
import { redis } from '../../../../shared/config/redis';
import { APP_VERSION } from '../../../../shared/config/constants';
import { env } from '../../../../shared/config/env';
import { paginate } from '../../../../shared/utils/pagination';
import { metricsStore } from '../../../../shared/utils/metrics';
import { jobRegistry } from '../../../../jobs/job-registry';
import { AppError } from '../../../../shared/utils/app-error';

const REQUIRED_ENV_KEYS = [
  'DATABASE_URL',
  'REDIS_URL',
  'JWT_PRIVATE_KEY',
  'JWT_PUBLIC_KEY',
  'JWT_REFRESH_SECRET',
  'FRONTEND_URL',
  'VAPID_PUBLIC_KEY',
  'VAPID_PRIVATE_KEY',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'AWS_S3_BUCKET',
  'AWS_SES_FROM',
] as const;

export class DeveloperUseCases {
  async system() {
    const memory = process.memoryUsage();
    const load = os.loadavg()[0] ?? 0;
    const cpuPercent = Math.min(100, Math.round((load / os.cpus().length) * 100));
    return {
      uptimeSeconds: Math.round(process.uptime()),
      cpuPercent,
      ramUsedMb: Math.round((os.totalmem() - os.freemem()) / 1024 / 1024),
      ramTotalMb: Math.round(os.totalmem() / 1024 / 1024),
      heapUsedMb: Math.round(memory.heapUsed / 1024 / 1024),
      heapTotalMb: Math.round(memory.heapTotal / 1024 / 1024),
      nodeVersion: process.version,
      appVersion: APP_VERSION,
      buildNumber: process.env.RAILWAY_GIT_COMMIT_SHA ?? 'local',
      requestsPerMinute: metricsStore.requestsPerMinute(),
      latency: metricsStore.latencyPercentiles(),
      errorsLastHour: metricsStore.errorCounts(),
    };
  }

  async services() {
    const redisInfo = await redis.info('memory');
    const usedMemoryMatch = redisInfo.match(/used_memory_human:(.+)/);
    return {
      postgres: { connected: true },
      redis: {
        ping: await redis.ping(),
        memory: usedMemoryMatch?.[1]?.trim() ?? 'unknown',
        keys: await redis.dbsize(),
      },
      s3: { configured: Boolean(env.AWS_S3_BUCKET) },
      ses: { configured: Boolean(env.AWS_SES_FROM) },
      youtube: { reachable: true },
      webPush: {
        subscriptions: await prisma.pushSubscription.count(),
      },
    };
  }

  async logs(query: { level?: string; search?: string; page?: number; limit?: number }) {
    const pagination = paginate(query);
    const where = {
      level: query.level,
      message: query.search ? { contains: query.search, mode: 'insensitive' as const } : undefined,
    };
    const [data, total] = await prisma.$transaction([
      prisma.systemLog.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.systemLog.count({ where }),
    ]);
    return { data, total, page: pagination.page, limit: pagination.limit };
  }

  async audit(query: { userId?: string; entity?: string; page?: number; limit?: number }) {
    const pagination = paginate(query);
    const where = { userId: query.userId, entity: query.entity };
    const [data, total] = await prisma.$transaction([
      prisma.auditLog.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.auditLog.count({ where }),
    ]);
    return { data, total, page: pagination.page, limit: pagination.limit };
  }

  async jobs() {
    return jobRegistry.status();
  }

  async triggerJob(name: string) {
    const ran = await jobRegistry.trigger(name);
    if (!ran) {
      throw AppError.notFound('Job not found');
    }
    return { name, triggered: true };
  }

  envCheck() {
    return REQUIRED_ENV_KEYS.map((key) => ({
      key,
      present: Boolean(process.env[key] && process.env[key] !== ''),
    }));
  }
}
