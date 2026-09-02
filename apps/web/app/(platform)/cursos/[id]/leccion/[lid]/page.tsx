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
    <div className="space-y-6">
      <p className="text-sm text-muted">
        <Link className="text-accent" href={`/cursos/${params.id}`}>
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
              className="mt-4 space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                submit.mutate();
              }}
            >
              <textarea
                className="min-h-[120px] w-full resize-y rounded-[10px] border-[1.5px] border-border bg-paper px-3.5 py-2.5 text-[15px]"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                required
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
