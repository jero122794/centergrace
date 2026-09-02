// apps/api/src/modules/uploads/uploads.integration.test.ts
import { randomUUID } from 'crypto';
import request from 'supertest';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../app';
import { redis } from '../../shared/config/redis';
import { authHeader, createTestUser, loginToken } from '../../test/helpers';
import { resetDatabase } from '../../test/reset-db';

const PNG_1X1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
);

describe('Uploads HTTP', () => {
  const app = createApp();
  const suffix = randomUUID().slice(0, 8);

  beforeAll(async () => {
    await redis.connect().catch(() => undefined);
  });

  beforeEach(async () => {
    await resetDatabase();
  });

  it('stores an image locally when S3 is not configured', async () => {
    const leader = await createTestUser('LEADER', suffix);
    const token = await loginToken(app, leader.email, leader.password);
    const response = await request(app)
      .post('/api/uploads')
      .set(authHeader(token))
      .attach('file', PNG_1X1, { filename: 'dot.png', contentType: 'image/png' });
    expect(response.status).toBe(201);
    expect(response.body.data.storage).toBe('local');
    expect(response.body.data.url).toMatch(/^\/uploads\/.+\.png$/);
    const served = await request(app).get(response.body.data.url as string);
    expect(served.status).toBe(200);
  });

  it('rejects a disallowed MIME type', async () => {
    const leader = await createTestUser('LEADER', `${suffix}b`);
    const token = await loginToken(app, leader.email, leader.password);
    const response = await request(app)
      .post('/api/uploads')
      .set(authHeader(token))
      .attach('file', Buffer.from('not-a-gif'), { filename: 'x.gif', contentType: 'image/gif' });
    expect(response.status).toBe(422);
  });
});
