// apps/api/src/modules/notifications/notifications.integration.test.ts
import { randomUUID } from 'crypto';
import request from 'supertest';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../app';
import { redis } from '../../shared/config/redis';
import { authHeader, createTestUser, loginToken, tipTapBody } from '../../test/helpers';
import { resetDatabase } from '../../test/reset-db';

describe('Notifications HTTP', () => {
  const app = createApp();
  const suffix = randomUUID().slice(0, 8);

  beforeAll(async () => {
    await redis.connect().catch(() => undefined);
  });

  beforeEach(async () => {
    await resetDatabase();
  });

  it('creates an in-app notification when a submission is graded', async () => {
    const leader = await createTestUser('LEADER', suffix);
    const student = await createTestUser('STUDENT', `${suffix}s`);
    const leaderToken = await loginToken(app, leader.email, leader.password);
    const course = await request(app)
      .post('/api/courses')
      .set(authHeader(leaderToken))
      .send({ title: 'Discipulado', description: 'Trabajos prácticos' });
    const lesson = await request(app)
      .post(`/api/courses/${course.body.data.id}/lessons`)
      .set(authHeader(leaderToken))
      .send({
        title: 'Testimonio',
        bodyContent: tipTapBody,
        order: 1,
        status: 'PUBLISHED',
        hasAssignment: true,
        assignmentDescription: 'Escribe tu testimonio',
      });
    const studentToken = await loginToken(app, student.email, student.password);
    const submitted = await request(app)
      .post('/api/submissions')
      .set(authHeader(studentToken))
      .send({ lessonId: lesson.body.data.id, content: 'Cristo restauró mi vida.' });
    await request(app)
      .put(`/api/grades/${submitted.body.data.id}`)
      .set(authHeader(leaderToken))
      .send({ score: 88, feedback: 'Excelente' });
    const list = await request(app).get('/api/notifications').set(authHeader(studentToken));
    expect(list.status).toBe(200);
    expect(list.body.data[0].title).toBe('Calificación recibida');
    const unread = await request(app).get('/api/notifications/unread-count').set(authHeader(studentToken));
    expect(unread.body.data.count).toBe(1);
    const marked = await request(app)
      .patch(`/api/notifications/${list.body.data[0].id}/read`)
      .set(authHeader(studentToken));
    expect(marked.status).toBe(200);
    const after = await request(app).get('/api/notifications/unread-count').set(authHeader(studentToken));
    expect(after.body.data.count).toBe(0);
  });

  it('stores a push subscription for the current user', async () => {
    const student = await createTestUser('STUDENT', `${suffix}p`);
    const token = await loginToken(app, student.email, student.password);
    const created = await request(app)
      .post('/api/notifications/subscribe')
      .set(authHeader(token))
      .send({
        endpoint: 'https://push.example.com/sub/1',
        keys: { p256dh: 'p256dh-key', auth: 'auth-key' },
      });
    expect(created.status).toBe(201);
    const status = await request(app).get('/api/notifications/push-status').set(authHeader(token));
    expect(status.body.data.subscribed).toBe(true);
  });
});
