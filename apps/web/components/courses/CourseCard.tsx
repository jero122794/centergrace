// apps/web/components/courses/CourseCard.tsx
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface Props {
  id: string;
  title: string;
  description: string;
  scope: string;
}

export const CourseCard = ({ id, title, description, scope }: Props) => (
  <Link href={`/cursos/${id}`}>
    <Card className="h-full hover:border-teal/40">
      <Badge>{scope}</Badge>
      <h3 className="mt-3 font-display text-xl">{title}</h3>
      <p className="mt-2 line-clamp-3 text-sm text-slate-600">{description}</p>
    </Card>
  </Link>
);
