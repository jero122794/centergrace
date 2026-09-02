// apps/api/src/shared/config/constants.ts
export const APP_NAME = 'Centro Misionero Shalom';
export const APP_VERSION = '1.0.0';
export const DEFAULT_CHURCH_NAME = 'Centro Misionero Shalom';
export const DEFAULT_PRIMARY_COLOR = '#4A7C7F';
export const DEFAULT_ACCENT_COLOR = '#C4A574';

export const BCRYPT_ROUNDS = 12;
export const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;
export const REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60;
export const PRESIGNED_URL_TTL_SECONDS = 60 * 60;
export const BODY_SIZE_LIMIT = '10mb';
export const PARTICIPATION_EDIT_WINDOW_MS = 24 * 60 * 60 * 1000;
export const SUBMISSION_REMINDER_HOURS = 48;
export const REHEARSAL_REMINDER_HOURS = 24;
export const WORSHIP_DEFAULT_MIN_PROGRESS = 80;
export const GRADE_MIN_SCORE = 0;
export const GRADE_MAX_SCORE = 100;

export const AUTH_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
export const AUTH_RATE_LIMIT_MAX = 10;
export const GENERAL_RATE_LIMIT_WINDOW_MS = 60 * 1000;
export const GENERAL_RATE_LIMIT_MAX = 100;
export const UPLOAD_RATE_LIMIT_WINDOW_MS = 60 * 1000;
export const UPLOAD_RATE_LIMIT_MAX = 5;

export const REFRESH_COOKIE_NAME = 'refreshToken';
export const REFRESH_COOKIE_PATH = '/api/auth';

export const ALLOWED_UPLOAD_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.pdf', '.mp3'] as const;
export const ALLOWED_UPLOAD_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'audio/mpeg',
] as const;

export const PROTECTED_ROLE = 'DEVELOPER' as const;
export const ASSIGNABLE_ROLES = ['ADMIN', 'LEADER', 'STUDENT'] as const;
export const DISPLAY_TIME_ZONE = 'America/Bogota';

export const CRON_EXPRESSIONS = {
  DEVOTIONAL_REMINDER: '0 7 * * *',
  SUBMISSION_DUE: '0 8 * * *',
  PARTICIPATION_REMINDER: '0 18 * * *',
  REHEARSAL_REMINDER: '0 20 * * *',
} as const;

export const JOB_NAMES = {
  DEVOTIONAL_REMINDER: 'devotional-reminder',
  SUBMISSION_DUE: 'submission-due',
  PARTICIPATION_REMINDER: 'participation-reminder',
  REHEARSAL_REMINDER: 'rehearsal-reminder',
} as const;

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;
