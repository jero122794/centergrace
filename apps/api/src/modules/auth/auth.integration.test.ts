// apps/api/src/modules/auth/auth.integration.test.ts
import { randomUUID } from 'crypto';
import request from 'supertest';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../app';
import { redis } from '../../shared/config/redis';
import { authHeader, createTestUser, loginToken } from '../../test/helpers';
import { resetDatabase } from '../../test/reset-db';

describe('Auth HTTP', () => {
  const app = createApp();
  const suffix = randomUUID().slice(0, 8);

  beforeAll(async () => {
    await redis.connect().catch(() => undefined);
  });

  beforeEach(async () => {
    await resetDatabase();
  });

  it('registers a student and returns the current user', async () => {
    const email = `nuevo.${suffix}@iglesia.com`;
    const created = await request(app).post('/api/auth/register').send({
      name: 'Nuevo Miembro',
      email,
      password: 'Estudiante123!',
    });
    expect(created.status).toBe(201);
    const me = await request(app)
      .get('/api/auth/me')
      .set(authHeader(created.body.data.accessToken));
    expect(me.status).toBe(200);
    expect(me.body.data.email).toBe(email);
    expect(me.body.data.role).toBe('STUDENT');
    expect(me.body.data.passwordHash).toBeUndefined();
  });

  it('rejects invalid credentials', async () => {
    const user = await createTestUser('STUDENT', suffix);
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: user.email, password: 'wrong-pass' });
    expect(response.status).toBe(401);
  });

  it('logs in a seeded-style leader', async () => {
    const user = await createTestUser('LEADER', `${suffix}b`);
    const token = await loginToken(app, user.email, user.password);
    expect(token.split('.').length).toBe(3);
  });

  it('rotates the refresh cookie and rejects reuse after logout', async () => {
    const user = await createTestUser('STUDENT', `${suffix}r`);
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: user.email, password: user.password });
    expect(login.status).toBe(200);
    const firstCookie = cookieHeader(login);
    expect(firstCookie).toContain('refreshToken=');
    expect(firstCookie).toMatch(/HttpOnly/i);
    expect(firstCookie).toMatch(/SameSite=Strict/i);
    expect(firstCookie).toContain('Path=/api/auth');
    const rotated = await request(app).post('/api/auth/refresh').set('Cookie', firstCookie);
    expect(rotated.status).toBe(200);
    expect(rotated.body.data.accessToken).toBeTruthy();
    const reused = await request(app).post('/api/auth/refresh').set('Cookie', firstCookie);
    expect(reused.status).toBe(401);
    const logout = await request(app)
      .post('/api/auth/logout')
      .set('Cookie', cookieHeader(rotated));
    expect(logout.status).toBe(200);
    const afterLogout = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', cookieHeader(rotated));
    expect(afterLogout.status).toBe(401);
  });
});

const cookieHeader = (response: request.Response): string => {
  const raw = response.headers['set-cookie'];
  if (!raw) {
    return '';
  }
  return Array.isArray(raw) ? raw.join('; ') : raw;
};
