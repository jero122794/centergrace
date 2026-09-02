// apps/web/app/(developer)/developer/sistema/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { SystemMetricCard } from '@/components/developer/SystemMetricCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import styles from './page.module.css';

const SystemPage = () => {
  const query = useQuery({
    queryKey: ['dev-system'],
    queryFn: async () => (await api.get('/api/developer/system')).data.data,
  });
  const data = query.data ?? {};
  return (
    <div className={styles.page}>
      <PageHeader kicker="Developer" title="Sistema" description="Métricas del proceso Node." />
      {query.isLoading ? (
        <Skeleton lines={2} />
      ) : (
        <div className={styles.grid}>
          <SystemMetricCard label="Uptime" value={data.uptimeSeconds ?? 0} unit="s" />
          <SystemMetricCard label="CPU" value={data.cpuPercent ?? 0} unit="%" percent={Number(data.cpuPercent ?? 0)} enterDelay={60} />
          <SystemMetricCard label="RAM" value={data.ramUsedMb ?? 0} unit="MB" enterDelay={120} />
          <SystemMetricCard label="Heap" value={data.heapUsedMb ?? 0} unit="MB" enterDelay={180} />
          <SystemMetricCard label="Latencia p95" value={data.latency?.p95 ?? 0} unit="ms" enterDelay={240} />
          <SystemMetricCard label="Req / min" value={data.requestsPerMinute ?? 0} enterDelay={300} />
        </div>
      )}
    </div>
  );
};

export default SystemPage;
