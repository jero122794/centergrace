// apps/web/app/(developer)/developer/sistema/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { SystemMetricCard } from '@/components/developer/SystemMetricCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { Skeleton } from '@/components/ui/Skeleton';

const SystemPage = () => {
  const query = useQuery({
    queryKey: ['dev-system'],
    queryFn: async () => (await api.get('/api/developer/system')).data.data,
  });
  const data = query.data ?? {};
  return (
    <div className="space-y-6">
      <PageHeader kicker="Developer" title="Sistema" description="Métricas del proceso Node." />
      {query.isLoading ? (
        <Skeleton lines={2} />
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <SystemMetricCard label="Uptime" value={data.uptimeSeconds ?? 0} unit="s" />
          <SystemMetricCard label="CPU" value={data.cpuPercent ?? 0} unit="%" percent={Number(data.cpuPercent ?? 0)} />
          <SystemMetricCard label="RAM" value={data.ramUsedMb ?? 0} unit="MB" />
          <SystemMetricCard label="Heap" value={data.heapUsedMb ?? 0} unit="MB" />
          <SystemMetricCard label="Latencia p95" value={data.latency?.p95 ?? 0} unit="ms" />
          <SystemMetricCard label="Req / min" value={data.requestsPerMinute ?? 0} />
        </div>
      )}
    </div>
  );
};

export default SystemPage;
