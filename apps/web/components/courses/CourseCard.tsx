// apps/web/components/courses/CourseCard.tsx
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/courses/ProgressBar';

interface Props {
  id: string;
  title: string;
  description: string;
  scope: string;
  percent?: number;
}

/**
 * Course summary tile linking to the lesson list.
 */
export const CourseCard = ({ id, title, description, scope, percent }: Props) => (
  <Link href={`/cursos/${id}`} className="block h-full">
    <Card hover className="h-full">
      <Badge tone="warm">{scope}</Badge>
      <h3 className="mt-3 font-display text-base font-bold text-dark">{title}</h3>
      <p className="mt-2 line-clamp-3 text-sm text-muted">{description}</p>
      {typeof percent === 'number' ? <ProgressBar className="mt-4" percent={percent} /> : null}
      <p className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent">
        Continuar
        <ArrowRight className="h-4 w-4" aria-hidden />
      </p>
    </Card>
  </Link>
);
