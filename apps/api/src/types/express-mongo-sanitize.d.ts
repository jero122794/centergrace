// apps/api/src/types/express-mongo-sanitize.d.ts
declare module 'express-mongo-sanitize' {
  import type { RequestHandler } from 'express';
  const mongoSanitize: (options?: Record<string, unknown>) => RequestHandler;
  export default mongoSanitize;
}
