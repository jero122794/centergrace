// apps/web/app/(developer)/developer/logs/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';

const LogsPage = () => {
  const query = useQuery({
    queryKey: ['dev-logs'],
    queryFn: async () => (await api.get('/api/developer/logs')).data,
  });
  return (
    <div className="space-y-3">
      <h1 className="font-display text-3xl text-teal">System logs</h1>
      {query.data?.data?.map((item: { id: string; level: string; message: string }) => (
        <Card key={item.id}>
          <p className="text-xs uppercase">{item.level}</p>
          <p>{item.message}</p>
        </Card>
      ))}
    </div>
  );
};

export default LogsPage;
