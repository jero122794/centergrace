// apps/web/app/(admin)/admin/contenido/page.tsx
'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { api } from '@/lib/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { TipTapEditor } from '@/components/editor/TipTapEditor';
import { useState } from 'react';

const ContentPage = () => {
  const client = useQueryClient();
  const form = useForm<{ title: string; description: string }>();
  const [body, setBody] = useState<unknown>({ type: 'doc', content: [{ type: 'paragraph' }] });
  const courses = useQuery({
    queryKey: ['courses'],
    queryFn: async () => (await api.get('/api/courses')).data.data,
  });
  const create = useMutation({
    mutationFn: async (values: { title: string; description: string }) => {
      const created = await api.post('/api/courses', values);
      await api.post(`/api/courses/${created.data.data.id}/lessons`, {
        title: 'Lección 1',
        bodyContent: body,
        order: 1,
        status: 'PUBLISHED',
      });
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ['courses'] }),
  });

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl text-teal">Contenido</h1>
      <form className="space-y-3" onSubmit={form.handleSubmit((values) => create.mutate(values))}>
        <Input label="Título del curso" {...form.register('title')} />
        <Input label="Descripción" {...form.register('description')} />
        <TipTapEditor value={body} onChange={setBody} />
        <Button type="submit">Crear curso y lección</Button>
      </form>
      {courses.data?.map((course: { id: string; title: string }) => (
        <Card key={course.id}>{course.title}</Card>
      ))}
    </div>
  );
};

export default ContentPage;
