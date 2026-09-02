// apps/web/app/(platform)/cursos/page.tsx
'use client';

import { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
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

const CoursesList = () => {
  const params = useSearchParams();
  const term = (params.get('q') ?? '').trim().toLowerCase();
  const query = useQuery({
    queryKey: ['courses'],
    queryFn: async () => (await api.get<{ data: Course[] }>('/api/courses')).data.data,
  });
  const courses = useMemo(
    () =>
      (query.data ?? []).filter(
        (course) => !term || course.title.toLowerCase().includes(term) || course.description.toLowerCase().includes(term),
      ),
    [query.data, term],
  );

  return (
    <div className="space-y-6">
      <PageHeader kicker="Formación" title="Cursos" description="Estudia a tu ritmo con el material de tu iglesia." />
      {query.isLoading ? <Skeleton lines={3} /> : null}
      {query.isError ? <Alert>No se pudieron cargar los cursos.</Alert> : null}
      {!query.isLoading && courses.length === 0 ? (
        <EmptyState title="Aún no hay cursos" description="Cuando tus líderes publiquen material, aparecerá aquí." />
      ) : null}
      {courses.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>
      ) : null}
    </div>
  );
};

const CoursesPage = () => (
  <Suspense fallback={<Skeleton lines={3} />}>
    <CoursesList />
  </Suspense>
);

export default CoursesPage;
