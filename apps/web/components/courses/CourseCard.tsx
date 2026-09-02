// apps/web/components/courses/CourseCard.tsx
import Link from 'next/link';
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
 * Course entry as a slightly tilted paper sheet.
 */
export const CourseCard = ({ id, title, description, scope, percent }: Props) => (
  <Link href={`/cursos/${id}`} className="block h-full">
    <article className="sheet sheet-hover h-full">
      <Badge tone="warm">{scope}</Badge>
      <h3 className="mt-4 font-display text-xl leading-snug text-dark">{title}</h3>
      <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed text-muted">{description}</p>
      {typeof percent === 'number' ? <ProgressBar className="mt-5" percent={percent} /> : null}
      <p className="mt-5 text-sm text-accent underline decoration-gold/80 underline-offset-4">Abrir lección</p>
    </article>
  </Link>
);
