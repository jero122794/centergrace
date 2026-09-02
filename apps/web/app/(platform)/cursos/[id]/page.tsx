// apps/web/app/(platform)/cursos/[id]/page.tsx
'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ProgressBar } from '@/components/courses/ProgressBar';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Alert } from '@/components/ui/Alert';
import stack from '@/components/ui/PageStack.module.css';

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

  if (course.isLoading) {
    return <Skeleton lines={4} />;
  }
  if (course.isError || !course.data) {
    return <Alert>No se pudo cargar el curso.</Alert>;
  }

  const lessons = (course.data.lessons as Lesson[] | undefined) ?? [];

  return (
    <div className={stack.page}>
      <PageHeader title={course.data.title} description={course.data.description} />
      <ProgressBar percent={progress.data?.percent ?? 0} />
      {lessons.length === 0 ? (
        <EmptyState title="Sin lecciones" description="Este curso todavía no tiene lecciones publicadas." />
      ) : (
        lessons.map((lesson, index) => (
          <Link key={lesson.id} href={`/cursos/${params.id}/leccion/${lesson.id}`}>
            <Card hover enterDelay={index * 60}>
              <div className={stack.row}>
                <p className={stack.name}>{lesson.title}</p>
                <span className={stack.link}>Abrir</span>
              </div>
            </Card>
          </Link>
        ))
      )}
    </div>
  );
};

export default CourseDetailPage;
