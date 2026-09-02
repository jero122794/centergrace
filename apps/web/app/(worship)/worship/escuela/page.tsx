// apps/web/app/(worship)/worship/escuela/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/courses/ProgressBar';
import { PageHeader } from '@/components/ui/PageHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { Alert } from '@/components/ui/Alert';
import stack from '@/components/ui/PageStack.module.css';

interface SchoolStatus {
  ministry: { id: string; name: string };
  minProgress: number;
  canAudition: boolean;
  courses: Array<{
    course: { id: string; title: string; description: string };
    percent: number;
    completed: number;
    published: number;
    meetsThreshold: boolean;
  }>;
}

const SchoolPage = () => {
  const query = useQuery({
    queryKey: ['worship-school'],
    queryFn: async () => (await api.get('/api/worship/school')).data.data as SchoolStatus,
  });

  if (query.isLoading) {
    return <Skeleton lines={3} />;
  }
  if (query.isError || !query.data) {
    return <Alert>No se pudo cargar la escuela de alabanza.</Alert>;
  }

  return (
    <div className={stack.tight}>
      <PageHeader kicker="Alabanza" title="Escuela de alabanza" description="Cursos requeridos para audicionar." />
      <p className={stack.muted}>
        Completa los cursos de {query.data.ministry.name} hasta {query.data.minProgress}% para habilitar tu audición.
      </p>
      <Badge tone={query.data.canAudition ? 'teal' : 'gold'}>
        {query.data.canAudition ? 'Lista para audicionar' : 'En formación'}
      </Badge>
      {query.data.courses.length === 0 ? (
        <p className={stack.muted}>Este ministerio aún no tiene cursos requeridos.</p>
      ) : null}
      {query.data.courses.map((item) => (
        <Card key={item.course.id} className={stack.list}>
          <div className={stack.row}>
            <Link className={stack.link} href={`/cursos/${item.course.id}`}>
              {item.course.title}
            </Link>
            <Badge tone={item.meetsThreshold ? 'teal' : 'gold'}>{`${item.percent}%`}</Badge>
          </div>
          <p className={stack.muted}>{item.course.description}</p>
          <ProgressBar percent={item.percent} />
          <p className={stack.muted}>
            {item.completed} de {item.published} lecciones
          </p>
        </Card>
      ))}
    </div>
  );
};

export default SchoolPage;
