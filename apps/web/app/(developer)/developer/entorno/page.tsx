// apps/web/app/(developer)/developer/entorno/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/ui/PageHeader';

const EnvPage = () => {
  const query = useQuery({
    queryKey: ['dev-env'],
    queryFn: async () => (await api.get('/api/developer/env-check')).data.data,
  });
  return (
    <div className="space-y-3">
      <PageHeader kicker="Sistema" title="Variables de entorno" description="Solo presencia o ausencia, nunca valores." />
      {query.data?.map((item: { key: string; present: boolean }) => (
        <Card key={item.key} className="flex items-center justify-between">
          <p>{item.key}</p>
          <Badge tone={item.present ? 'teal' : 'danger'}>{item.present ? 'presente' : 'ausente'}</Badge>
        </Card>
      ))}
    </div>
  );
};

export default EnvPage;
