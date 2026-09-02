// apps/api/src/modules/settings/settings.integration.test.ts
import { randomUUID } from 'crypto';
import request from 'supertest';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../app';
import { redis } from '../../shared/config/redis';
import { authHeader, createTestUser, loginToken } from '../../test/helpers';
import { resetDatabase } from '../../test/reset-db';

describe('Church settings HTTP', () => {
  const app = createApp();
  const suffix = randomUUID().slice(0, 8);

  beforeAll(async () => {
    await redis.connect().catch(() => undefined);
  });

  beforeEach(async () => {
    await resetDatabase();
  });

  it('returns default branding and lets an admin update it', async () => {
    const admin = await createTestUser('ADMIN', suffix);
    const token = await loginToken(app, admin.email, admin.password);
    const initial = await request(app).get('/api/settings').set(authHeader(token));
    expect(initial.status).toBe(200);
    expect(initial.body.data.churchName).toBe('Centro Misionero Shalom');
    const updated = await request(app)
      .patch('/api/settings')
      .set(authHeader(token))
      .send({ churchName: 'Shalom Norte', primaryColor: '#123456' });
    expect(updated.status).toBe(200);
    expect(updated.body.data.churchName).toBe('Shalom Norte');
    expect(updated.body.data.primaryColor).toBe('#123456');
  });

  it('forbids a student from updating settings', async () => {
    const student = await createTestUser('STUDENT', suffix);
    const token = await loginToken(app, student.email, student.password);
    const response = await request(app)
      .patch('/api/settings')
      .set(authHeader(token))
      .send({ churchName: 'No permitido' });
    expect(response.status).toBe(403);
  });
});
