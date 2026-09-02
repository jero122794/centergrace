// apps/api/src/test/helpers.ts
import type { Express } from 'express';
import type { Role } from '@prisma/client';
import request from 'supertest';
import { prisma } from '../shared/config/prisma';
import { hashSecret } from '../shared/utils/crypto';

const TIPTAP_BODY = {
  type: 'doc',
  content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Contenido de prueba' }] }],
};

export const tipTapBody = TIPTAP_BODY;

export interface TestUser {
  id: string;
  email: string;
  password: string;
  role: Role;
}

/**
 * Inserts a user with a known password for HTTP integration tests.
 */
export const createTestUser = async (
  role: Role,
  suffix: string,
): Promise<TestUser> => {
  const email = `${role.toLowerCase()}.${suffix}@iglesia.com`;
  const password = 'Clave123!';
  const user = await prisma.user.create({
    data: {
      name: `${role} ${suffix}`,
      email,
      passwordHash: await hashSecret(password),
      role,
    },
  });
  return { id: user.id, email, password, role };
};

/**
 * Returns a Bearer access token for the given credentials.
 */
export const loginToken = async (
  app: Express,
  email: string,
  password: string,
): Promise<string> => {
  const response = await request(app).post('/api/auth/login').send({ email, password });
  if (response.status !== 200) {
    throw new Error(`Login failed: ${response.status} ${JSON.stringify(response.body)}`);
  }
  return response.body.data.accessToken as string;
};

export const authHeader = (token: string): { Authorization: string } => ({
  Authorization: `Bearer ${token}`,
});
