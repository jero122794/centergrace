// apps/api/prisma/run-prisma.ts
import './load-env';
import { spawn } from 'node:child_process';

const child = spawn('prisma', process.argv.slice(2), {
  stdio: 'inherit',
  env: process.env,
  shell: true,
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});
