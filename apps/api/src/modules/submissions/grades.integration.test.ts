// apps/api/src/modules/submissions/grades.integration.test.ts
import { randomUUID } from 'crypto';
import request from 'supertest';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../app';
import { redis } from '../../shared/config/redis';
import { authHeader, createTestUser, loginToken, tipTapBody } from '../../test/helpers';
import { resetDatabase } from '../../test/reset-db';

describe('Grades HTTP', () => {
  const app = createApp();
  const suffix = randomUUID().slice(0, 8);

  beforeAll(async () => {
    await redis.connect().catch(() => undefined);
  });

  beforeEach(async () => {
    await resetDatabase();
  });

  it('grades a pending submission and notifies via graded status', async () => {
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
    expect(submitted.status).toBe(201);
    const graded = await request(app)
      .put(`/api/grades/${submitted.body.data.id}`)
      .set(authHeader(leaderToken))
      .send({ score: 95, feedback: 'Excelente testimonio' });
    expect(graded.status).toBe(200);
    expect(graded.body.data.score).toBe(95);
    const mine = await request(app).get('/api/submissions/mine').set(authHeader(studentToken));
    expect(mine.body.data[0].status).toBe('GRADED');
    expect(mine.body.data[0].grade.score).toBe(95);
  });
});
