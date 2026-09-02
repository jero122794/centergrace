// apps/api/src/modules/worship/auditions.integration.test.ts
import { randomUUID } from 'crypto';
import request from 'supertest';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../app';
import { prisma } from '../../shared/config/prisma';
import { redis } from '../../shared/config/redis';
import { authHeader, createTestUser, loginToken } from '../../test/helpers';
import { resetDatabase } from '../../test/reset-db';

describe('Worship auditions HTTP', () => {
  const app = createApp();
  const suffix = randomUUID().slice(0, 8);

  beforeAll(async () => {
    await redis.connect().catch(() => undefined);
  });

  beforeEach(async () => {
    await resetDatabase();
  });

  it('moves an application to approved and assigns a musical role', async () => {
    const leader = await createTestUser('LEADER', suffix);
    const student = await createTestUser('STUDENT', `${suffix}s`);
    const ministry = await prisma.ministry.create({
      data: {
        name: 'Ministerio de Alabanza',
        type: 'MINISTRY',
        leaderId: leader.id,
        createdById: leader.id,
      },
    });
    const studentToken = await loginToken(app, student.email, student.password);
    const applied = await request(app)
      .post('/api/worship/auditions')
      .set(authHeader(studentToken))
      .send({ ministryId: ministry.id, musicalRole: 'VOCALIST' });
    expect(applied.status).toBe(201);
    expect(applied.body.data.status).toBe('PENDING');
    const leaderToken = await loginToken(app, leader.email, leader.password);
    const approved = await request(app)
      .patch(`/api/worship/auditions/${applied.body.data.id}`)
      .set(authHeader(leaderToken))
      .send({ status: 'APPROVED', musicalRole: 'VOCALIST' });
    expect(approved.status).toBe(200);
    expect(approved.body.data.status).toBe('APPROVED');
    const role = await prisma.ministryMemberRole.findUnique({
      where: { userId_ministryId: { userId: student.id, ministryId: ministry.id } },
    });
    expect(role?.musicalRole).toBe('VOCALIST');
  });

  it('reports school progress and an empty team until someone is approved', async () => {
    const leader = await createTestUser('LEADER', `${suffix}t`);
    const student = await createTestUser('STUDENT', `${suffix}u`);
    const ministry = await prisma.ministry.create({
      data: {
        name: 'Alabanza',
        type: 'MINISTRY',
        leaderId: leader.id,
        createdById: leader.id,
      },
    });
    const course = await prisma.course.create({
      data: {
        title: 'Teoría',
        description: 'Curso requerido',
        createdById: leader.id,
        lessons: { create: { title: 'Nota', bodyContent: { type: 'doc' }, order: 1, status: 'PUBLISHED' } },
      },
    });
    await prisma.worshipSchoolConfig.create({
      data: {
        ministryId: ministry.id,
        minProgress: 80,
        requiredCourses: { create: [{ courseId: course.id }] },
      },
    });
    const studentToken = await loginToken(app, student.email, student.password);
    const school = await request(app)
      .get('/api/worship/school')
      .query({ ministryId: ministry.id })
      .set(authHeader(studentToken));
    expect(school.status).toBe(200);
    expect(school.body.data.canAudition).toBe(false);
    expect(school.body.data.courses[0].percent).toBe(0);
    const leaderToken = await loginToken(app, leader.email, leader.password);
    const team = await request(app).get('/api/worship/team').set(authHeader(leaderToken));
    expect(team.status).toBe(200);
    expect(team.body.data).toEqual([]);
  });
});
