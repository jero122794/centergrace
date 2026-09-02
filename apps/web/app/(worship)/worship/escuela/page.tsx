// apps/web/app/(worship)/worship/escuela/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/courses/ProgressBar';

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
    return <p>Cargando escuela…</p>;
  }
  if (query.isError || !query.data) {
    return <p className="text-red-600">No se pudo cargar la escuela de alabanza.</p>;
  }

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl text-teal">Escuela de alabanza</h1>
      <p className="text-slate-600">
        Completa los cursos de {query.data.ministry.name} hasta {query.data.minProgress}% para habilitar tu audición.
      </p>
      <Badge tone={query.data.canAudition ? 'teal' : 'gold'}>
        {query.data.canAudition ? 'Lista para audicionar' : 'En formación'}
      </Badge>
      {query.data.courses.length === 0 ? (
        <p className="text-sm text-slate-500">Este ministerio aún no tiene cursos requeridos.</p>
      ) : null}
      {query.data.courses.map((item) => (
        <Card key={item.course.id} className="space-y-2">
          <div className="flex items-center justify-between">
            <Link className="font-medium text-teal" href={`/cursos/${item.course.id}`}>
              {item.course.title}
            </Link>
            <Badge tone={item.meetsThreshold ? 'teal' : 'gold'}>{`${item.percent}%`}</Badge>
          </div>
          <p className="text-sm text-slate-500">{item.course.description}</p>
          <ProgressBar percent={item.percent} />
          <p className="text-xs text-slate-400">
            {item.completed} de {item.published} lecciones
          </p>
        </Card>
      ))}
    </div>
  );
};

export default SchoolPage;
