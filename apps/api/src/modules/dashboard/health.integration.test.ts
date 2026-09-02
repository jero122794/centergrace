// apps/api/src/modules/dashboard/health.integration.test.ts
import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../../app';
import { redis } from '../../shared/config/redis';

describe('Health HTTP', () => {
  const app = createApp();

  beforeAll(async () => {
    await redis.connect().catch(() => undefined);
  });

  it('reports postgres and redis as healthy', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.data.status).toBe('ok');
    expect(response.body.data.postgres).toBe(true);
    expect(response.body.data.redis).toBe(true);
  });
});
