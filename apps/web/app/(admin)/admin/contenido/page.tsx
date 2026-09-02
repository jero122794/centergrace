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
import { PageHeader } from '@/components/ui/PageHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Alert } from '@/components/ui/Alert';
import stack from '@/components/ui/PageStack.module.css';

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
    <div className={stack.page}>
      <PageHeader kicker="Pastoreo" title="Contenido" description="Cursos y lecciones de la iglesia." />
      <Card>
        <h2 className={stack.title}>Nuevo curso</h2>
        <form className={stack.list} onSubmit={form.handleSubmit((values) => createCourse.mutate(values))}>
          <Input label="Título" {...form.register('title', { required: true })} />
          <Input label="Descripción" {...form.register('description', { required: true })} />
          <Button type="submit" disabled={createCourse.isPending}>
            Crear curso
          </Button>
        </form>
      </Card>
      {courses.isLoading ? <Skeleton lines={2} /> : null}
      {courses.isError ? <Alert>No se pudieron cargar los cursos.</Alert> : null}
      {!courses.isLoading && courses.data?.length === 0 ? (
        <EmptyState title="Sin cursos" description="Crea el primero con el formulario de arriba." />
      ) : null}
      <div className={stack.grid2}>
        {courses.data?.map((course) => (
          <button key={course.id} type="button" className={stack.pick} onClick={() => setSelectedId(course.id)}>
            <Card selected={selectedId === course.id}>
              <p className={stack.name}>{course.title}</p>
              <p className={stack.muted}>{course._count?.lessons ?? 0} lecciones</p>
            </Card>
          </button>
        ))}
      </div>
      {selected.data ? (
        <Card className={stack.tight}>
          <h2 className={stack.title}>{selected.data.title}</h2>
          <ul className={stack.list}>
            {selected.data.lessons.map((lesson) => (
              <li key={lesson.id} className={stack.lessonRow}>
                <span>{lesson.title}</span>
                <span className={stack.actions}>
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
