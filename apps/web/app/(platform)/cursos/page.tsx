// apps/web/app/(platform)/cursos/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { CourseCard } from '@/components/courses/CourseCard';

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

  if (query.isLoading) {
    return <p>Cargando cursos…</p>;
  }
  if (!query.data?.length) {
    return <p>No hay cursos disponibles todavía.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {query.data.map((course) => (
        <CourseCard key={course.id} {...course} />
      ))}
    </div>
  );
};

export default CoursesPage;
