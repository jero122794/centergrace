// apps/web/app/(admin)/admin/contenido/page.tsx
'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { api } from '@/lib/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LessonEditor } from '@/components/courses/LessonEditor';

interface CourseSummary {
  id: string;
  title: string;
  description: string;
  _count?: { lessons: number; enrollments: number };
}

interface CourseDetail extends CourseSummary {
  lessons: Array<{ id: string; title: string; status: string; youtubeTitle?: string | null; hasAssignment: boolean }>;
}

const ContentPage = () => {
  const client = useQueryClient();
  const form = useForm<{ title: string; description: string }>();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const courses = useQuery({
    queryKey: ['courses'],
    queryFn: async () => (await api.get('/api/courses')).data.data as CourseSummary[],
  });
  const selected = useQuery({
    queryKey: ['course', selectedId],
    queryFn: async () => (await api.get(`/api/courses/${selectedId}`)).data.data as CourseDetail,
    enabled: Boolean(selectedId),
  });
  const createCourse = useMutation({
    mutationFn: async (values: { title: string; description: string }) => api.post('/api/courses', values),
    onSuccess: (response) => {
      form.reset();
      setSelectedId(response.data.data.id as string);
      void client.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-teal">Contenido</h1>
      <Card>
        <h2 className="mb-3 font-display text-xl">Nuevo curso</h2>
        <form className="space-y-3" onSubmit={form.handleSubmit((values) => createCourse.mutate(values))}>
          <Input label="Título" {...form.register('title', { required: true })} />
          <Input label="Descripción" {...form.register('description', { required: true })} />
          <Button type="submit" disabled={createCourse.isPending}>
            Crear curso
          </Button>
        </form>
      </Card>
      {courses.isLoading ? <p>Cargando cursos…</p> : null}
      {courses.isError ? <p className="text-red-600">No se pudieron cargar los cursos.</p> : null}
      {!courses.isLoading && courses.data?.length === 0 ? <p>No hay cursos todavía.</p> : null}
      <div className="grid gap-3 md:grid-cols-2">
        {courses.data?.map((course) => (
          <button key={course.id} type="button" className="text-left" onClick={() => setSelectedId(course.id)}>
            <Card className={selectedId === course.id ? 'ring-2 ring-teal' : ''}>
              <p className="font-medium">{course.title}</p>
              <p className="text-sm text-slate-500">{course._count?.lessons ?? 0} lecciones</p>
            </Card>
          </button>
        ))}
      </div>
      {selected.data ? (
        <Card className="space-y-4">
          <h2 className="font-display text-2xl text-teal">{selected.data.title}</h2>
          <ul className="space-y-2">
            {selected.data.lessons.map((lesson) => (
              <li key={lesson.id} className="flex items-center justify-between rounded-xl bg-cream px-3 py-2">
                <span>{lesson.title}</span>
                <span className="flex gap-2">
                  {lesson.youtubeTitle ? <Badge>YouTube</Badge> : null}
                  {lesson.hasAssignment ? <Badge tone="gold">Asignación</Badge> : null}
                  <Badge tone={lesson.status === 'PUBLISHED' ? 'teal' : 'neutral'}>{lesson.status}</Badge>
                </span>
              </li>
            ))}
          </ul>
          <LessonEditor
            courseId={selected.data.id}
            onCreated={() => {
              void client.invalidateQueries({ queryKey: ['course', selected.data.id] });
              void client.invalidateQueries({ queryKey: ['courses'] });
            }}
          />
        </Card>
      ) : null}
    </div>
  );
};

export default ContentPage;
