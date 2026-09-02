// apps/web/app/(developer)/developer/sistema/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { StatCard } from '@/components/dashboard/StatCard';

const SystemPage = () => {
  const query = useQuery({
    queryKey: ['dev-system'],
    queryFn: async () => (await api.get('/api/developer/system')).data.data,
  });
  const data = query.data ?? {};
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard label="Uptime (s)" value={data.uptimeSeconds ?? 0} />
      <StatCard label="CPU %" value={data.cpuPercent ?? 0} />
      <StatCard label="RAM MB" value={data.ramUsedMb ?? 0} />
      <StatCard label="Heap MB" value={data.heapUsedMb ?? 0} />
      <StatCard label="p95 ms" value={data.latency?.p95 ?? 0} />
      <StatCard label="Req/min" value={data.requestsPerMinute ?? 0} />
    </div>
  );
};

export default SystemPage;
