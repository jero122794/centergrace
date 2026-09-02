// apps/web/app/(platform)/cursos/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { CourseCard } from '@/components/courses/CourseCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { Alert } from '@/components/ui/Alert';

interface Course {
  id: string;
  title: string;
  description: string;
  scope: string;
}

const CoursesPage = () => {
  const query = useQuery({
    queryKey: ['courses'],
    queryFn: async () => (await api.get<{ data: Course[] }>('/api/courses')).data.data,
  });

  return (
    <div className="space-y-6">
      <PageHeader kicker="Formación" title="Cursos" description="Estudia a tu ritmo con el material de tu iglesia." />
      {query.isLoading ? <Skeleton lines={3} /> : null}
      {query.isError ? <Alert>No se pudieron cargar los cursos.</Alert> : null}
      {!query.isLoading && query.data?.length === 0 ? (
        <EmptyState
          icon="book"
          title="Aún no hay cursos"
          description="Cuando tus líderes publiquen material, aparecerá aquí."
        />
      ) : null}
      {query.data && query.data.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {query.data.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default CoursesPage;
