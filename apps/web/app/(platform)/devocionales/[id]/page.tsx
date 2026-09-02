// apps/web/app/(platform)/devocionales/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { TipTapRenderer } from '@/components/editor/TipTapRenderer';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

interface Question {
  id: string;
  text: string;
}

const DevotionalDetailPage = () => {
  const params = useParams<{ id: string }>();
  const client = useQueryClient();
  const [content, setContent] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const today = useQuery({
    queryKey: ['devotional-today'],
    queryFn: async () => (await api.get('/api/devotionals/today')).data.data,
  });
  const participate = useMutation({
    mutationFn: async () =>
      api.post(`/api/devotionals/${params.id}/participations`, {
        content,
        answers: Object.entries(answers).map(([questionId, answer]) => ({ questionId, answer })),
      }),
    onSuccess: () => client.invalidateQueries({ queryKey: ['devotional-today'] }),
  });

  const item = today.data;
  if (!item) {
    return <p>Cargando…</p>;
  }

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl text-teal">{item.title}</h1>
      <p className="italic">{item.verse}</p>
      <TipTapRenderer content={item.content} />
      {(item.questions as Question[]).map((question) => (
        <label key={question.id} className="block">
          <span className="text-sm font-medium">{question.text}</span>
          <textarea
            className="mt-1 w-full rounded-xl border p-3"
            onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))}
          />
        </label>
      ))}
      <textarea
        className="w-full rounded-xl border p-3"
        placeholder="Reflexión general"
        value={content}
        onChange={(event) => setContent(event.target.value)}
      />
      <Button onClick={() => participate.mutate()}>Enviar participación</Button>
    </div>
  );
};

export default DevotionalDetailPage;
