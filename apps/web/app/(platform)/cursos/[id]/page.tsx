// apps/web/app/(platform)/cursos/[id]/page.tsx
'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ProgressBar } from '@/components/courses/ProgressBar';
import { Card } from '@/components/ui/Card';

interface Lesson {
  id: string;
  title: string;
  status: string;
}

const CourseDetailPage = () => {
  const params = useParams<{ id: string }>();
  const course = useQuery({
    queryKey: ['course', params.id],
    queryFn: async () => (await api.get(`/api/courses/${params.id}`)).data.data,
  });
  const progress = useQuery({
    queryKey: ['progress', params.id],
    queryFn: async () => (await api.get(`/api/courses/${params.id}/progress`)).data.data,
  });

  if (!course.data) {
    return <p>Cargando curso…</p>;
  }

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl text-teal">{course.data.title}</h1>
      <p>{course.data.description}</p>
      <ProgressBar percent={progress.data?.percent ?? 0} />
      {(course.data.lessons as Lesson[]).map((lesson) => (
        <Card key={lesson.id}>
          <Link href={`/cursos/${params.id}/leccion/${lesson.id}`}>{lesson.title}</Link>
        </Card>
      ))}
    </div>
  );
};

export default CourseDetailPage;
