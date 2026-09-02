// apps/api/src/shared/utils/crypto.ts
import { randomBytes, randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import { BCRYPT_ROUNDS } from '../config/constants';

const TOKEN_BYTES = 48;

/**
 * Hashes a plaintext secret with bcrypt (12 rounds).
 */
export const hashSecret = async (plain: string): Promise<string> => {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
};

/**
 * Compares a plaintext secret against a bcrypt hash.
 */
export const verifySecret = async (plain: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(plain, hash);
};

/**
 * Generates an opaque refresh token (URL-safe).
 */
export const generateOpaqueToken = (): string => {
  return randomBytes(TOKEN_BYTES).toString('base64url');
};

/**
 * Generates a UUID v4 for stored file names.
 */
export const generateFileId = (): string => randomUUID();

/**
 * Generates a temporary password for leader-created students.
 */
export const generateTemporaryPassword = (): string => {
  return `Shalom-${randomBytes(6).toString('base64url')}!`;
};
