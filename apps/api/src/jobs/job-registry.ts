// apps/api/src/jobs/job-registry.ts
import cron from 'node-cron';
import { prisma } from '../shared/config/prisma';
import { logger } from '../shared/utils/logger';
import { CRON_EXPRESSIONS, JOB_NAMES } from '../shared/config/constants';
import { runDevotionalReminderJob } from './devotional-reminder.job';
import { runSubmissionDueJob } from './submission-due.job';
import { runParticipationReminderJob } from './participation-reminder.job';
import { runRehearsalReminderJob } from './rehearsal-reminder.job';

type JobHandler = () => Promise<{ notified: number }>;

interface RegisteredJob {
  name: string;
  expression: string;
  handler: JobHandler;
  task: cron.ScheduledTask;
  lastRun?: { startedAt: Date; durationMs: number; status: string; result?: unknown };
}

class JobRegistry {
  private jobs: RegisteredJob[] = [];

  start(): void {
    this.register(JOB_NAMES.DEVOTIONAL_REMINDER, CRON_EXPRESSIONS.DEVOTIONAL_REMINDER, runDevotionalReminderJob);
    this.register(JOB_NAMES.SUBMISSION_DUE, CRON_EXPRESSIONS.SUBMISSION_DUE, runSubmissionDueJob);
    this.register(
      JOB_NAMES.PARTICIPATION_REMINDER,
      CRON_EXPRESSIONS.PARTICIPATION_REMINDER,
      runParticipationReminderJob,
    );
    this.register(JOB_NAMES.REHEARSAL_REMINDER, CRON_EXPRESSIONS.REHEARSAL_REMINDER, runRehearsalReminderJob);
  }

  status() {
    return this.jobs.map((job) => ({
      name: job.name,
      expression: job.expression,
      lastRun: job.lastRun ?? null,
    }));
  }

  async trigger(name: string): Promise<boolean> {
    const job = this.jobs.find((item) => item.name === name);
    if (!job) {
      return false;
    }
    await this.execute(job);
    return true;
  }

  private register(name: string, expression: string, handler: JobHandler): void {
    const task = cron.schedule(expression, () => {
      const registered = this.jobs.find((item) => item.name === name);
      if (registered) {
        void this.execute(registered);
      }
    });
    this.jobs.push({ name, expression, handler, task });
  }

  private async execute(job: RegisteredJob): Promise<void> {
    const startedAt = new Date();
    try {
      const result = await job.handler();
      const durationMs = Date.now() - startedAt.getTime();
      job.lastRun = { startedAt, durationMs, status: 'success', result };
      await prisma.jobRun.create({
        data: { name: job.name, startedAt, finishedAt: new Date(), durationMs, status: 'success', result },
      });
    } catch (error) {
      const durationMs = Date.now() - startedAt.getTime();
      const message = error instanceof Error ? error.message : 'unknown';
      job.lastRun = { startedAt, durationMs, status: 'error', result: { message } };
      logger.error('Cron job failed', { context: job.name, message });
      await prisma.systemLog.create({
        data: { level: 'error', message, context: job.name },
      });
    }
  }
}

export const jobRegistry = new JobRegistry();
