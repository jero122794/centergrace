// apps/web/app/(platform)/mis-trabajos/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';

interface SubmissionItem {
  id: string;
  status: string;
  lesson: { title: string };
  grade?: { score: number };
}

const MyWorkPage = () => {
  const query = useQuery({
    queryKey: ['my-submissions'],
    queryFn: async () => (await api.get('/api/submissions/mine')).data.data as SubmissionItem[],
  });

  return (
    <div className="space-y-4">
      <PageHeader kicker="Estudiante" title="Mis trabajos" description="Entregas y calificaciones de tus lecciones." />
      {query.isLoading ? <Skeleton lines={3} /> : null}
      {!query.isLoading && query.data?.length === 0 ? (
        <EmptyState icon="clipboard" title="Sin entregas" description="Cuando envíes una asignación, la verás aquí." />
      ) : null}
      {query.data?.map((item) => (
        <Card key={item.id}>
          <div className="flex items-center justify-between">
            <p>{item.lesson.title}</p>
            <Badge tone={item.status === 'GRADED' ? 'teal' : 'gold'}>{item.status}</Badge>
          </div>
          {item.grade ? <p className="mt-2 text-sm">Nota: {item.grade.score}/100</p> : null}
        </Card>
      ))}
    </div>
  );
};

export default MyWorkPage;
