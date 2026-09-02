// apps/api/prisma/load-env.ts
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import dotenv from 'dotenv';

const files = [
  resolve(__dirname, '../.env'),
  resolve(__dirname, '../../../.env'),
];

for (const file of files) {
  if (existsSync(file)) {
    dotenv.config({ path: file });
  }
}
