// apps/web/components/grading/GradeBadge.tsx
import { Badge } from '@/components/ui/Badge';

interface Props {
  score: number | null;
  status: string;
}

export const GradeBadge = ({ score, status }: Props) => {
  if (status !== 'GRADED' || score === null) {
    return <Badge tone="gold">Pendiente</Badge>;
  }
  const tone = score >= 80 ? 'teal' : score >= 60 ? 'gold' : 'danger';
  return <Badge tone={tone}>{`${score}/100`}</Badge>;
};
