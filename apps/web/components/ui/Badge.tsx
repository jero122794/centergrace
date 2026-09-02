// apps/web/components/ui/Badge.tsx
import { cx } from '@/lib/cn';
import styles from './Badge.module.css';

export type BadgeTone =
  | 'developer'
  | 'admin'
  | 'leader'
  | 'student'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'warm'
  | 'worship'
  | 'neutral'
  | 'teal'
  | 'gold';

interface Props {
  children: string;
  tone?: BadgeTone;
  className?: string;
}

const tones: Record<BadgeTone, string> = {
  developer: styles.developer,
  admin: styles.admin,
  leader: styles.leader,
  student: styles.student,
  success: styles.success,
  warning: styles.warning,
  danger: styles.danger,
  info: styles.info,
  warm: styles.warm,
  worship: styles.worship,
  neutral: styles.neutral,
  teal: styles.teal,
  gold: styles.gold,
};

/**
 * Compact status or role pill.
 *
 * @example
 * <Badge tone="student">STUDENT</Badge>
 */
export const Badge = ({ children, tone = 'neutral', className }: Props) => (
  <span className={cx(styles.chip, tones[tone], className)}>{children}</span>
);

/**
 * Maps a platform role to its badge tone.
 */
export const roleTone = (role: string): BadgeTone => {
  if (role === 'DEVELOPER') return 'developer';
  if (role === 'ADMIN') return 'admin';
  if (role === 'LEADER') return 'leader';
  return 'student';
};
