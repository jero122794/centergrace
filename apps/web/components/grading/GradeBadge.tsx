// apps/web/components/grading/GradeBadge.tsx
import { cn } from '@/lib/cn';

interface Props {
  score: number | null;
  status?: string;
  large?: boolean;
}

/**
 * Numeric grade chip. Colors follow 70 / 50 thresholds.
 */
export const GradeBadge = ({ score, status, large = false }: Props) => {
  if ((status && status !== 'GRADED') || score === null) {
    return (
      <span className="inline-flex rounded-full bg-warm px-3 py-1 text-[11px] font-medium text-gold-d">Pendiente</span>
    );
  }
  const tone =
    score >= 70 ? 'bg-success text-success-d' : score >= 50 ? 'bg-warning text-warning-d' : 'bg-danger text-danger-d';
  return (
    <span className={cn('inline-flex rounded-full font-bold', large ? 'px-4 py-1.5 text-lg' : 'px-3 py-1 text-[13px]', tone)}>
      {score}/100
    </span>
  );
};
