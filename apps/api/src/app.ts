// apps/api/src/app.ts
import express, { type Express, type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { BODY_SIZE_LIMIT } from './shared/config/constants';
import { env } from './shared/config/env';
import { prisma } from './shared/config/prisma';
import { pingRedis } from './shared/config/redis';
import { buildOpenApiDocument } from './shared/config/swagger';
import { errorMiddleware } from './shared/middleware/error.middleware';
import { generalLimiter } from './shared/middleware/rate-limit.middleware';
import { metricsStore } from './shared/utils/metrics';
import { authRouter } from './modules/auth/interface/routes/auth.routes';
import { userRouter } from './modules/users/interface/routes/user.routes';
import { ministryRouter } from './modules/ministries/interface/routes/ministry.routes';
import { groupRouter } from './modules/groups/interface/routes/group.routes';
import { courseRouter, lessonRouter } from './modules/courses/interface/routes/course.routes';
import { devotionalRouter } from './modules/devotionals/interface/routes/devotional.routes';
import { gradeRouter, submissionRouter } from './modules/submissions/interface/routes/submission.routes';
import { spiritualNoteRouter } from './modules/spiritual-notes/interface/routes/spiritual-note.routes';
import { worshipRouter } from './modules/worship/interface/routes/worship.routes';
import { notificationRouter } from './modules/notifications/interface/routes/notification.routes';
import { developerRouter } from './modules/developer/interface/routes/developer.routes';
import { dashboardRouter } from './modules/dashboard/interface/routes/dashboard.routes';
import { uploadRouter } from './modules/uploads/interface/routes/upload.routes';
import { settingRouter } from './modules/settings/interface/routes/setting.routes';
import { UPLOADS_DIR } from './modules/uploads/infrastructure/UploadService';

/**
 * Builds the Express application with security middleware and module routers.
 */
export const createApp = (): Express => {
  const app = express();
  app.set('trust proxy', 1);
  applySecurity(app);
  app.use(metricsMiddleware);
  app.use(generalLimiter);
  registerRoutes(app);
  app.use(errorMiddleware);
  return app;
};

const applySecurity = (app: Express): void => {
  app.disable('x-powered-by');
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https://*.amazonaws.com', 'https://i.ytimg.com', 'https://img.youtube.com'],
          mediaSrc: ["'self'", 'https://www.youtube.com'],
          frameSrc: ['https://www.youtube.com'],
          connectSrc: ["'self'"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: { policy: 'same-origin' },
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      dnsPrefetchControl: { allow: false },
      frameguard: { action: 'deny' },
      hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
      ieNoOpen: true,
      noSniff: true,
      permittedCrossDomainPolicies: false,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      xssFilter: true,
    }),
  );
  app.use(
    cors({
      origin: [env.FRONTEND_URL],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
      maxAge: 600,
    }),
  );
  app.use(express.json({ limit: BODY_SIZE_LIMIT }));
  app.use(express.urlencoded({ extended: true, limit: BODY_SIZE_LIMIT }));
  app.use(cookieParser());
  app.use(hpp());
  app.use(mongoSanitize());
};

const metricsMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const started = Date.now();
  res.on('finish', () => {
    metricsStore.record(Date.now() - started, res.statusCode);
  });
  next();
};

const registerRoutes = (app: Express): void => {
  /**
   * @swagger
   * /api/health:
   *   get:
   *     summary: Health check de PostgreSQL y Redis
   *     tags: [Health]
   *     responses:
   *       200:
   *         description: Sistema saludable
   *       503:
   *         description: Dependencia caída
   */
  app.get('/api/health', async (_req: Request, res: Response) => {
    const postgres = await prisma.$queryRaw`SELECT 1`.then(() => true).catch(() => false);
    const redisOk = await pingRedis().catch(() => false);
    const healthy = postgres && redisOk;
    res.status(healthy ? 200 : 503).json({
      data: { status: healthy ? 'ok' : 'degraded', postgres, redis: redisOk, uptime: process.uptime() },
    });
  });
  if (env.NODE_ENV !== 'production') {
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(buildOpenApiDocument()));
  }
  app.use('/uploads', express.static(UPLOADS_DIR));
  app.use('/api/auth', authRouter);
  app.use('/api/users', userRouter);
  app.use('/api/ministries', ministryRouter);
  app.use('/api/groups', groupRouter);
  app.use('/api/courses', courseRouter);
  app.use('/api/lessons', lessonRouter);
  app.use('/api/devotionals', devotionalRouter);
  app.use('/api/submissions', submissionRouter);
  app.use('/api/grades', gradeRouter);
  app.use('/api/spiritual-notes', spiritualNoteRouter);
  app.use('/api/worship', worshipRouter);
  app.use('/api/notifications', notificationRouter);
  app.use('/api/developer', developerRouter);
  app.use('/api/dashboard', dashboardRouter);
  app.use('/api/uploads', uploadRouter);
  app.use('/api/settings', settingRouter);
};
