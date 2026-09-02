// apps/api/src/modules/courses/courses.integration.test.ts
import { randomUUID } from 'crypto';
import request from 'supertest';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../app';
import { redis } from '../../shared/config/redis';
import { authHeader, createTestUser, loginToken, tipTapBody } from '../../test/helpers';
import { resetDatabase } from '../../test/reset-db';

describe('Courses HTTP', () => {
  const app = createApp();
  const suffix = randomUUID().slice(0, 8);

  beforeAll(async () => {
    await redis.connect().catch(() => undefined);
  });

  beforeEach(async () => {
    await resetDatabase();
  });

  it('lets a leader create a course and a student complete a lesson', async () => {
    const leader = await createTestUser('LEADER', suffix);
    const student = await createTestUser('STUDENT', `${suffix}s`);
    const leaderToken = await loginToken(app, leader.email, leader.password);
    const created = await request(app)
      .post('/api/courses')
      .set(authHeader(leaderToken))
      .send({ title: 'Fundamentos de la Fe', description: 'Curso introductorio' });
    expect(created.status).toBe(201);
    const courseId = created.body.data.id as string;
    const lesson = await request(app)
      .post(`/api/courses/${courseId}/lessons`)
      .set(authHeader(leaderToken))
      .send({ title: 'Gracia', bodyContent: tipTapBody, order: 1, status: 'PUBLISHED' });
    expect(lesson.status).toBe(201);
    await request(app)
      .post(`/api/courses/${courseId}/enroll`)
      .set(authHeader(leaderToken))
      .send({ userId: student.id });
    const studentToken = await loginToken(app, student.email, student.password);
    const completed = await request(app)
      .post(`/api/lessons/${lesson.body.data.id}/complete`)
      .set(authHeader(studentToken));
    expect(completed.status).toBe(200);
    const progress = await request(app)
      .get(`/api/courses/${courseId}/progress`)
      .set(authHeader(studentToken));
    expect(progress.body.data.percent).toBe(100);
  });

  it('forbids a student from creating courses', async () => {
    const student = await createTestUser('STUDENT', `${suffix}x`);
    const token = await loginToken(app, student.email, student.password);
    const response = await request(app)
      .post('/api/courses')
      .set(authHeader(token))
      .send({ title: 'No permitido', description: 'Debe fallar' });
    expect(response.status).toBe(403);
  });
});
