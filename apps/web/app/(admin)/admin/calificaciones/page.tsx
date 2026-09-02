// apps/web/app/(admin)/admin/calificaciones/page.tsx
'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { GradeBadge } from '@/components/grading/GradeBadge';
import { SubmissionReviewer, type SubmissionForReview } from '@/components/grading/SubmissionReviewer';
import { PageHeader } from '@/components/ui/PageHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Alert } from '@/components/ui/Alert';

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
      <PageHeader kicker="Pastoreo" title="Calificaciones" description="Revisa entregas lado a lado." />
      {query.isLoading ? <Skeleton lines={3} /> : null}
      {query.isError ? <Alert>No se pudieron cargar las entregas.</Alert> : null}
      {!query.isLoading && query.data?.length === 0 ? (
        <EmptyState title="Sin trabajos pendientes" description="Cuando los estudiantes entreguen, aparecerán aquí." />
      ) : null}
      {query.data && query.data.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
          <div className="space-y-2">
            {query.data.map((item) => (
              <button key={item.id} type="button" className="w-full text-left" onClick={() => setSelectedId(item.id)}>
            <Card className={selected?.id === item.id ? 'ring-2 ring-accent' : ''}>
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
