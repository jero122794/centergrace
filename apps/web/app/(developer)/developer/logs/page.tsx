// apps/web/app/(developer)/developer/logs/page.tsx
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { LogViewer, type SystemLogRow } from '@/components/developer/LogViewer';
import { PageHeader } from '@/components/ui/PageHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import stack from '@/components/ui/PageStack.module.css';

const LogsPage = () => {
  const [level, setLevel] = useState<string | undefined>();
  const [search, setSearch] = useState<string | undefined>();
  const [autoRefresh, setAutoRefresh] = useState(false);
  const query = useQuery({
    queryKey: ['dev-logs', level, search],
    queryFn: async () =>
      (await api.get('/api/developer/logs', { params: { level, search } })).data.data as SystemLogRow[],
    refetchInterval: autoRefresh ? 30_000 : false,
  });

  return (
    <div className={stack.tight}>
      <PageHeader kicker="Sistema" title="Logs" description="Eventos técnicos del proceso." />
      {query.isLoading ? <Skeleton lines={3} /> : null}
      <LogViewer
        logs={query.data ?? []}
        autoRefresh={autoRefresh}
        onToggleRefresh={() => setAutoRefresh((value) => !value)}
        onFilter={(values) => {
          setLevel(values.level);
          setSearch(values.search);
        }}
      />
    </div>
  );
};

export default LogsPage;
