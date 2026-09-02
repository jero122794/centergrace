// apps/web/app/(platform)/cursos/[id]/leccion/[lid]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { VideoPlayer } from '@/components/courses/VideoPlayer';
import { TipTapRenderer } from '@/components/editor/TipTapRenderer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { Alert } from '@/components/ui/Alert';
import { useState } from 'react';

const LessonPage = () => {
  const params = useParams<{ id: string; lid: string }>();
  const client = useQueryClient();
  const [content, setContent] = useState('');
  const course = useQuery({
    queryKey: ['course', params.id],
    queryFn: async () => (await api.get(`/api/courses/${params.id}`)).data.data,
  });
  const lesson = (course.data?.lessons as Array<Record<string, unknown>> | undefined)?.find(
    (item) => item.id === params.lid,
  );

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
      <PageHeader kicker="Lección" title={String(lesson.title)} />
      {typeof lesson.youtubeId === 'string' && lesson.youtubeId ? (
        <VideoPlayer youtubeId={lesson.youtubeId} title={String(lesson.title)} />
      ) : null}
      <Card>
        <TipTapRenderer content={lesson.bodyContent} />
      </Card>
      <Button onClick={() => complete.mutate()} disabled={complete.isPending}>
        {complete.isSuccess ? 'Completada' : 'Marcar como completada'}
      </Button>
      {lesson.hasAssignment ? (
        <Card>
          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              submit.mutate();
            }}
          >
            <h2 className="font-display text-xl text-teal">Asignación</h2>
            <p className="text-sm text-ink/70">{String(lesson.assignmentDescription ?? '')}</p>
            <textarea value={content} onChange={(event) => setContent(event.target.value)} required rows={6} />
            <Button type="submit" disabled={submit.isPending}>
              {submit.isSuccess ? 'Entregado' : 'Entregar'}
            </Button>
          </form>
        </Card>
      ) : null}
    </div>
  );
};

export default LessonPage;
