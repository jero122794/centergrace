// apps/web/app/(platform)/mi-historial/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { formatDateBogota } from '@/lib/formatters';

const HistoryPage = () => {
  const query = useQuery({
    queryKey: ['history'],
    queryFn: async () => (await api.get('/api/devotionals/history')).data.data,
  });

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl text-teal">Mi historial</h1>
      {query.data?.map((item: { id: string; createdAt: string; devotional: { title: string }; content: string }) => (
        <Card key={item.id}>
          <p className="text-xs text-slate-500">{formatDateBogota(item.createdAt)}</p>
          <p className="font-medium">{item.devotional.title}</p>
          <p className="mt-2 text-sm">{item.content}</p>
        </Card>
      ))}
    </div>
  );
};

export default HistoryPage;
