// apps/api/src/modules/devotionals/devotionals.integration.test.ts
import { randomUUID } from 'crypto';
import request from 'supertest';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../app';
import { redis } from '../../shared/config/redis';
import { authHeader, createTestUser, loginToken, tipTapBody } from '../../test/helpers';
import { resetDatabase } from '../../test/reset-db';

describe('Devotionals HTTP', () => {
  const app = createApp();
  const suffix = randomUUID().slice(0, 8);

  beforeAll(async () => {
    await redis.connect().catch(() => undefined);
  });

  beforeEach(async () => {
    await resetDatabase();
  });

  it('publishes today\'s global devotional and records a participation', async () => {
    const leader = await createTestUser('LEADER', suffix);
    const student = await createTestUser('STUDENT', `${suffix}s`);
    const leaderToken = await loginToken(app, leader.email, leader.password);
    const date = new Date().toISOString().slice(0, 10);
    const created = await request(app)
      .post('/api/devotionals')
      .set(authHeader(leaderToken))
      .send({
        title: 'Confía en el Señor',
        content: tipTapBody,
        verse: 'Proverbios 3:5-6',
        date,
        scope: 'GLOBAL',
        status: 'PUBLISHED',
        questions: [{ text: '¿En qué área confiarás hoy?', order: 1 }],
      });
    expect(created.status).toBe(201);
    const questionId = created.body.data.questions[0].id as string;
    const studentToken = await loginToken(app, student.email, student.password);
    const today = await request(app).get('/api/devotionals/today').set(authHeader(studentToken));
    expect(today.status).toBe(200);
    expect(today.body.data.title).toBe('Confía en el Señor');
    const participation = await request(app)
      .post(`/api/devotionals/${created.body.data.id}/participations`)
      .set(authHeader(studentToken))
      .send({
        content: 'Quiero confiar el área laboral.',
        answers: [{ questionId, answer: 'El trabajo' }],
      });
    expect(participation.status).toBe(201);
  });
});
