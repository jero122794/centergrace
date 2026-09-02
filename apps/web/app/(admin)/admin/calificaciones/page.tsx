// apps/web/app/(admin)/admin/calificaciones/page.tsx
'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { GradeBadge } from '@/components/grading/GradeBadge';
import { SubmissionReviewer, type SubmissionForReview } from '@/components/grading/SubmissionReviewer';

const GradesPage = () => {
  const client = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const query = useQuery({
    queryKey: ['submissions'],
    queryFn: async () => (await api.get('/api/submissions')).data.data as SubmissionForReview[],
  });
  const selected = query.data?.find((item) => item.id === selectedId) ?? query.data?.[0] ?? null;
  const grade = useMutation({
    mutationFn: async (values: { score: number; feedback: string }) => {
      if (!selected) {
        return;
      }
      await api.put(`/api/grades/${selected.id}`, values);
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ['submissions'] }),
  });

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl text-teal">Calificaciones</h1>
      {query.isLoading ? <p>Cargando entregas…</p> : null}
      {query.isError ? <p className="text-red-600">No se pudieron cargar las entregas.</p> : null}
      {!query.isLoading && query.data?.length === 0 ? <p>No hay trabajos pendientes.</p> : null}
      {query.data && query.data.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
          <div className="space-y-2">
            {query.data.map((item) => (
              <button key={item.id} type="button" className="w-full text-left" onClick={() => setSelectedId(item.id)}>
                <Card className={selected?.id === item.id ? 'ring-2 ring-teal' : ''}>
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-medium">{item.user.name}</p>
                      <p className="text-xs text-slate-500">{item.lesson.title}</p>
                    </div>
                    <GradeBadge score={item.grade?.score ?? null} status={item.status} />
                  </div>
                </Card>
              </button>
            ))}
          </div>
          {selected ? (
            <SubmissionReviewer
              key={selected.id}
              submission={selected}
              submitting={grade.isPending}
              onGrade={(values) => grade.mutate(values)}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default GradesPage;
