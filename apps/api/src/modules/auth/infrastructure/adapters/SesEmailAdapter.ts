// apps/api/src/modules/auth/infrastructure/adapters/SesEmailAdapter.ts
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { APP_NAME } from '../../../../shared/config/constants';
import { env } from '../../../../shared/config/env';
import { logger } from '../../../../shared/utils/logger';

const MAX_ATTEMPTS = 3;

export interface WelcomeEmailInput {
  to: string;
  name: string;
  temporaryPassword?: string;
}

/**
 * Sends transactional email through AWS SES with retry. Falls back to logs in development.
 */
export class SesEmailAdapter {
  private readonly client: SESClient | null;

  constructor() {
    this.client =
      env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY
        ? new SESClient({ region: env.AWS_REGION })
        : null;
  }

  async sendWelcome(input: WelcomeEmailInput): Promise<void> {
    const passwordLine = input.temporaryPassword
      ? `Tu contraseña temporal es: ${input.temporaryPassword}`
      : 'Inicia sesión con la contraseña que registraste.';
    const body = `Hola ${input.name},\n\nBienvenido a ${APP_NAME}.\n${passwordLine}\n\n${env.FRONTEND_URL}/login\n`;
    await this.send(input.to, `Bienvenido a ${APP_NAME}`, body);
  }

  async send(to: string, subject: string, body: string): Promise<void> {
    if (!this.client || !env.AWS_SES_FROM) {
      logger.info('Email skipped (SES not configured)', { context: 'ses', to, subject });
      return;
    }
    let lastError: unknown;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
      try {
        await this.client.send(
          new SendEmailCommand({
            Source: env.AWS_SES_FROM,
            Destination: { ToAddresses: [to] },
            Message: {
              Subject: { Data: subject, Charset: 'UTF-8' },
              Body: { Text: { Data: body, Charset: 'UTF-8' } },
            },
          }),
        );
        return;
      } catch (error) {
        lastError = error;
        logger.warn('SES send failed', { context: 'ses', attempt });
      }
    }
    logger.error('SES send exhausted retries', {
      context: 'ses',
      message: lastError instanceof Error ? lastError.message : 'unknown',
    });
  }
}
