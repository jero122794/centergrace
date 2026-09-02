// packages/types/src/index.ts
/**
 * Shared domain types used by both the API and the web PWA.
 */

export const ROLES = ["DEVELOPER", "ADMIN", "LEADER", "STUDENT"] as const;
export type Role = (typeof ROLES)[number];

export const CONTENT_SCOPES = ["GLOBAL", "GROUP"] as const;
export type ContentScope = (typeof CONTENT_SCOPES)[number];

export const LESSON_STATUSES = ["DRAFT", "PUBLISHED"] as const;
export type LessonStatus = (typeof LESSON_STATUSES)[number];

export const DEVOTIONAL_STATUSES = ["DRAFT", "PUBLISHED"] as const;
export type DevotionalStatus = (typeof DEVOTIONAL_STATUSES)[number];

export const SUBMISSION_STATUSES = ["PENDING", "GRADED"] as const;
export type SubmissionStatus = (typeof SUBMISSION_STATUSES)[number];

export const MEMBERSHIP_STATUSES = ["ACTIVE", "INACTIVE", "PENDING"] as const;
export type MembershipStatus = (typeof MEMBERSHIP_STATUSES)[number];

export const AUDITION_STATUSES = [
  "PENDING",
  "SCHOOL",
  "ELIGIBLE",
  "SCHEDULED",
  "APPROVED",
  "REJECTED",
  "WAITLIST",
] as const;
export type AuditionStatus = (typeof AUDITION_STATUSES)[number];

export const MUSICAL_ROLES = [
  "VOCALIST",
  "GUITARIST",
  "BASSIST",
  "DRUMMER",
  "KEYBOARDIST",
  "SOUND",
  "OTHER",
] as const;
export type MusicalRole = (typeof MUSICAL_ROLES)[number];

export const GROUP_TYPES = ["MINISTRY", "CELL", "BIBLE_CLASS", "PRAYER", "OTHER"] as const;
export type GroupType = (typeof GROUP_TYPES)[number];

export const MEDIA_TYPES = ["audio", "youtube"] as const;
export type MediaType = (typeof MEDIA_TYPES)[number];

export interface ApiErrorBody {
  statusCode: number;
  error: string;
  message: string;
  details?: unknown;
}

export interface ApiSuccessBody<T> {
  data: T;
  message?: string;
}

export interface PaginatedBody<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  mustChangePassword: boolean;
  createdAt: string;
}

export interface AuthSession {
  user: PublicUser;
  accessToken: string;
}

export interface ChurchBranding {
  churchName: string;
  logoUrl: string | null;
  primaryColor: string;
  accentColor: string;
}
