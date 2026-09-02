// apps/web/components/courses/CourseCard.tsx
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';

interface Props {
  id: string;
  title: string;
  description: string;
  scope: string;
}

export const CourseCard = ({ id, title, description, scope }: Props) => (
  <Link href={`/cursos/${id}`} className="block h-full">
    <Card className="h-full transition hover:-translate-y-0.5 hover:border-teal/30 hover:shadow-lift">
      <Badge>{scope}</Badge>
      <h3 className="mt-3 font-display text-xl text-teal">{title}</h3>
      <p className="mt-2 line-clamp-3 text-sm text-ink/65">{description}</p>
      <p className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-teal">
        Abrir curso
        <Icon name="arrow" className="h-4 w-4" />
      </p>
    </Card>
  </Link>
);
