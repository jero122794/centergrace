// apps/web/app/(platform)/cursos/[id]/leccion/[lid]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { LessonView } from '@/components/courses/LessonView';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Alert } from '@/components/ui/Alert';
import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

const LessonPage = () => {
  const params = useParams<{ id: string; lid: string }>();
  const client = useQueryClient();
  const [content, setContent] = useState('');
  const course = useQuery({
    queryKey: ['course', params.id],
    queryFn: async () => (await api.get(`/api/courses/${params.id}`)).data.data,
  });
  const lessons = (course.data?.lessons as Array<Record<string, unknown>> | undefined) ?? [];
  const lesson = lessons.find((item) => item.id === params.lid);
  const complete = useMutation({
    mutationFn: async () => api.post(`/api/lessons/${params.lid}/complete`),
    onSuccess: () => client.invalidateQueries({ queryKey: ['progress', params.id] }),
  });
  const submit = useMutation({
    mutationFn: async () => api.post('/api/submissions', { lessonId: params.lid, content }),
  });

  if (course.isLoading) {
    return <Skeleton lines={4} />;
  }
  if (!lesson) {
    return <Alert>No se encontró la lección.</Alert>;
  }

  return (
    <div className={styles.page}>
      <p className={styles.crumb}>
        <Link href={`/cursos/${params.id}`}>
          {course.data.title}
        </Link>
        {' · '}
        {String(lesson.title)}
      </p>
      <LessonView
        title={String(lesson.title)}
        youtubeId={typeof lesson.youtubeId === 'string' ? lesson.youtubeId : null}
        bodyContent={lesson.bodyContent}
        hasAssignment={Boolean(lesson.hasAssignment)}
        assignmentDescription={typeof lesson.assignmentDescription === 'string' ? lesson.assignmentDescription : null}
        completed={complete.isSuccess}
        completing={complete.isPending}
        onComplete={() => complete.mutate()}
        assignmentSlot={
          lesson.hasAssignment ? (
            <form
              className={styles.assignment}
              onSubmit={(event) => {
                event.preventDefault();
                submit.mutate();
              }}
            >
              <textarea
                className={styles.work}
                value={content}
                onChange={(event) => setContent(event.target.value)}
                required
                aria-label="Tu entrega"
              />
              <Button type="submit" disabled={submit.isPending}>
                {submit.isSuccess ? 'Entregado' : 'Entregar'}
              </Button>
            </form>
          ) : null
        }
      />
    </div>
  );
};

export default LessonPage;
