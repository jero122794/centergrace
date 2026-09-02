// apps/web/app/(platform)/devocionales/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { TipTapRenderer } from '@/components/editor/TipTapRenderer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { Alert } from '@/components/ui/Alert';
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

  if (today.isLoading) {
    return <Skeleton lines={3} />;
  }
  const item = today.data;
  if (!item) {
    return <Alert>No se encontró el devocional.</Alert>;
  }

  return (
    <div className="space-y-4">
      <PageHeader title={item.title} description={item.verse} />
      <Card>
        <TipTapRenderer content={item.content} />
      </Card>
      {(item.questions as Question[]).map((question) => (
        <label key={question.id} className="block">
          <span className="text-sm font-medium">{question.text}</span>
          <textarea
            className="mt-1"
            rows={3}
            onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))}
          />
        </label>
      ))}
      <textarea rows={4} placeholder="Reflexión general" value={content} onChange={(event) => setContent(event.target.value)} />
      <Button onClick={() => participate.mutate()} disabled={participate.isPending}>
        {participate.isSuccess ? 'Participación enviada' : 'Enviar participación'}
      </Button>
    </div>
  );
};

export default DevotionalDetailPage;
