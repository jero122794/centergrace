// apps/web/app/(platform)/cursos/[id]/leccion/[lid]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { VideoPlayer } from '@/components/courses/VideoPlayer';
import { TipTapRenderer } from '@/components/editor/TipTapRenderer';
import { Button } from '@/components/ui/Button';
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

  if (!lesson) {
    return <p>Cargando lección…</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-teal">{String(lesson.title)}</h1>
      {typeof lesson.youtubeId === 'string' && lesson.youtubeId ? (
        <VideoPlayer youtubeId={lesson.youtubeId} title={String(lesson.title)} />
      ) : null}
      <TipTapRenderer content={lesson.bodyContent} />
      <Button onClick={() => complete.mutate()}>Marcar como completada</Button>
      {lesson.hasAssignment ? (
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            submit.mutate();
          }}
        >
          <h2 className="font-display text-xl">Asignación</h2>
          <p>{String(lesson.assignmentDescription ?? '')}</p>
          <textarea
            className="w-full rounded-xl border p-3"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            required
          />
          <Button type="submit">Entregar</Button>
        </form>
      ) : null}
    </div>
  );
};

export default LessonPage;
