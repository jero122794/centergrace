// apps/api/src/modules/groups/groups.integration.test.ts
import { randomUUID } from 'crypto';
import request from 'supertest';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../app';
import { redis } from '../../shared/config/redis';
import { authHeader, createTestUser, loginToken } from '../../test/helpers';
import { resetDatabase } from '../../test/reset-db';

describe('Groups and spiritual notes HTTP', () => {
  const app = createApp();
  const suffix = randomUUID().slice(0, 8);

  beforeAll(async () => {
    await redis.connect().catch(() => undefined);
  });

  beforeEach(async () => {
    await resetDatabase();
  });

  it('lets a leader manage only their own group and private notes', async () => {
    const leader = await createTestUser('LEADER', suffix);
    const other = await createTestUser('LEADER', `${suffix}o`);
    const student = await createTestUser('STUDENT', `${suffix}s`);
    const leaderToken = await loginToken(app, leader.email, leader.password);
    const created = await request(app)
      .post('/api/groups')
      .set(authHeader(leaderToken))
      .send({ name: 'Célula Norte', type: 'CELL' });
    expect(created.status).toBe(201);
    const groupId = created.body.data.id as string;
    const added = await request(app)
      .post(`/api/groups/${groupId}/members`)
      .set(authHeader(leaderToken))
      .send({ userId: student.id });
    expect(added.status).toBe(201);
    const note = await request(app)
      .post('/api/spiritual-notes')
      .set(authHeader(leaderToken))
      .send({ userId: student.id, groupId, content: 'Muestra hambre espiritual.' });
    expect(note.status).toBe(201);
    const followUp = await request(app)
      .get(`/api/users/${student.id}/follow-up`)
      .set(authHeader(leaderToken));
    expect(followUp.status).toBe(200);
    expect(followUp.body.data.notes).toHaveLength(1);
    const otherToken = await loginToken(app, other.email, other.password);
    const blocked = await request(app)
      .get(`/api/groups/${groupId}/members`)
      .set(authHeader(otherToken));
    expect(blocked.status).toBe(403);
    const studentToken = await loginToken(app, student.email, student.password);
    const studentNotes = await request(app)
      .get('/api/spiritual-notes')
      .set(authHeader(studentToken));
    expect(studentNotes.status).toBe(403);
  });
});
