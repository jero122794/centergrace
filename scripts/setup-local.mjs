// scripts/setup-local.mjs
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const example = resolve(root, '.env.example');

if (!existsSync(example)) {
  console.error('Missing .env.example at the repo root.');
  process.exit(1);
}

const copyIfMissing = (from, to, label) => {
  if (existsSync(to)) {
    console.log(`skip  ${label} (already exists)`);
    return false;
  }
  copyFileSync(from, to);
  console.log(`wrote ${label}`);
  return true;
};

copyIfMissing(example, resolve(root, '.env'), '.env');
copyIfMissing(example, resolve(root, 'apps/api/.env'), 'apps/api/.env');

const webLocal = resolve(root, 'apps/web/.env.local');
if (existsSync(webLocal)) {
  console.log('skip  apps/web/.env.local (already exists)');
} else {
  const rootEnv = readFileSync(resolve(root, '.env'), 'utf8');
  const vapid = rootEnv.match(/^NEXT_PUBLIC_VAPID_KEY=(.*)$/m)?.[1]
    ?? rootEnv.match(/^VAPID_PUBLIC_KEY=(.*)$/m)?.[1]
    ?? '';
  const apiUrl = rootEnv.match(/^NEXT_PUBLIC_API_URL=(.*)$/m)?.[1] ?? 'http://localhost:3001';
  writeFileSync(
    webLocal,
    `NEXT_PUBLIC_API_URL=${apiUrl}\nNEXT_PUBLIC_VAPID_KEY=${vapid}\n`,
  );
  console.log('wrote apps/web/.env.local');
}

console.log(`
Listo. Siguiente:

  docker compose up -d postgres redis
  npm run db:migrate
  npm run db:seed
  npm run dev

Web: http://localhost:3000
API: http://localhost:3001
`);
