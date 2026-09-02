// apps/web/app/(platform)/mi-historial/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatDateBogota } from '@/lib/formatters';
import stack from '@/components/ui/PageStack.module.css';

interface HistoryItem {
  id: string;
  createdAt: string;
  devotional: { title: string };
  content: string;
}

const HistoryPage = () => {
  const query = useQuery({
    queryKey: ['history'],
    queryFn: async () => (await api.get('/api/devotionals/history')).data.data as HistoryItem[],
  });

  return (
    <div className={stack.tight}>
      <PageHeader kicker="Devocional" title="Mi historial" description="Tus participaciones diarias." />
      {query.isLoading ? <Skeleton lines={3} /> : null}
      {!query.isLoading && query.data?.length === 0 ? (
        <EmptyState title="Sin participaciones" description="Cuando completes un devocional, quedará registrado aquí." />
      ) : null}
      {query.data?.map((item) => (
        <Card key={item.id}>
          <p className={stack.muted}>{formatDateBogota(item.createdAt)}</p>
          <p className={stack.name}>{item.devotional.title}</p>
          <p className={stack.muted}>{item.content}</p>
        </Card>
      ))}
    </div>
  );
};

export default HistoryPage;
