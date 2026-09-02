// apps/web/app/(admin)/admin/calificaciones/page.tsx
'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

const GradesPage = () => {
  const client = useQueryClient();
  const [scores, setScores] = useState<Record<string, number>>({});
  const query = useQuery({
    queryKey: ['submissions'],
    queryFn: async () => (await api.get('/api/submissions')).data.data,
  });
  const grade = useMutation({
    mutationFn: async (id: string) => api.put(`/api/grades/${id}`, { score: scores[id] ?? 0, feedback: 'Bien hecho' }),
    onSuccess: () => client.invalidateQueries({ queryKey: ['submissions'] }),
  });

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl text-teal">Calificaciones</h1>
      {query.data?.map((item: { id: string; content: string; user: { name: string }; status: string }) => (
        <Card key={item.id} className="space-y-2">
          <p className="font-medium">{item.user.name}</p>
          <p className="text-sm">{item.content}</p>
          <input
            type="number"
            min={0}
            max={100}
            className="rounded-xl border px-3 py-2"
            onChange={(event) => setScores((current) => ({ ...current, [item.id]: Number(event.target.value) }))}
          />
          <Button onClick={() => grade.mutate(item.id)}>Calificar</Button>
        </Card>
      ))}
    </div>
  );
};

export default GradesPage;
