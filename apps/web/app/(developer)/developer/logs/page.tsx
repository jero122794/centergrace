// apps/web/app/(developer)/developer/logs/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';

const LogsPage = () => {
  const query = useQuery({
    queryKey: ['dev-logs'],
    queryFn: async () => (await api.get('/api/developer/logs')).data,
  });
  return (
    <div className="space-y-3">
      <PageHeader kicker="Sistema" title="Logs" />
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
