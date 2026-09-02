// apps/api/src/modules/users/users.integration.test.ts
import { randomUUID } from 'crypto';
import request from 'supertest';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../app';
import { redis } from '../../shared/config/redis';
import { authHeader, createTestUser, loginToken } from '../../test/helpers';
import { resetDatabase } from '../../test/reset-db';

describe('Users HTTP', () => {
  const app = createApp();
  const suffix = randomUUID().slice(0, 8);

  beforeAll(async () => {
    await redis.connect().catch(() => undefined);
  });

  beforeEach(async () => {
    await resetDatabase();
  });

  it('lets an admin promote a student and never assign DEVELOPER', async () => {
    const admin = await createTestUser('ADMIN', suffix);
    const student = await createTestUser('STUDENT', `${suffix}s`);
    const token = await loginToken(app, admin.email, admin.password);
    const promoted = await request(app)
      .patch(`/api/users/${student.id}/role`)
      .set(authHeader(token))
      .send({ role: 'LEADER' });
    expect(promoted.status).toBe(200);
    expect(promoted.body.data.role).toBe('LEADER');
    const forbidden = await request(app)
      .patch(`/api/users/${student.id}/role`)
      .set(authHeader(token))
      .send({ role: 'DEVELOPER' });
    expect(forbidden.status).toBe(400);
  });

  it('forbids a leader from changing roles', async () => {
    const leader = await createTestUser('LEADER', `${suffix}l`);
    const student = await createTestUser('STUDENT', `${suffix}t`);
    const token = await loginToken(app, leader.email, leader.password);
    const response = await request(app)
      .patch(`/api/users/${student.id}/role`)
      .set(authHeader(token))
      .send({ role: 'ADMIN' });
    expect(response.status).toBe(403);
  });
});
