// apps/web/components/ui/Badge.tsx
import { cn } from '@/lib/cn';

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
  developer: 'bg-[#E0E0E0] text-[#424242]',
  admin: 'bg-worship-l text-worship',
  leader: 'bg-[#FFF3E0] text-[#E65100]',
  student: 'bg-info text-info-d',
  success: 'bg-success text-success-d',
  warning: 'bg-warning text-warning-d',
  danger: 'bg-danger text-danger-d',
  info: 'bg-info text-info-d',
  warm: 'bg-warm text-gold-d',
  worship: 'bg-worship-l text-worship',
  neutral: 'bg-surface text-muted',
  teal: 'bg-success text-success-d',
  gold: 'bg-warm text-gold-d',
};

/**
 * Compact status or role pill.
 *
 * @example
 * <Badge tone="student">STUDENT</Badge>
 */
export const Badge = ({ children, tone = 'neutral', className }: Props) => (
  <span className={cn('chip inline-flex px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide', tones[tone], className)}>
    {children}
  </span>
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
