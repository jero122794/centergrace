// apps/web/app/(developer)/developer/jobs/page.tsx
'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { JobMonitor, type JobStatus } from '@/components/developer/JobMonitor';
import { PageHeader } from '@/components/ui/PageHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import stack from '@/components/ui/PageStack.module.css';

const JobsPage = () => {
  const client = useQueryClient();
  const query = useQuery({
    queryKey: ['dev-jobs'],
    queryFn: async () => (await api.get('/api/developer/jobs')).data.data as JobStatus[],
  });
  const trigger = useMutation({
    mutationFn: async (name: string) => api.post(`/api/developer/jobs/${name}/trigger`),
    onSuccess: () => client.invalidateQueries({ queryKey: ['dev-jobs'] }),
  });

  return (
    <div className={stack.tight}>
      <PageHeader kicker="Sistema" title="Cron jobs" />
      {query.isLoading ? <Skeleton lines={2} /> : null}
      <JobMonitor jobs={query.data ?? []} runningName={trigger.variables} onTrigger={(name) => trigger.mutate(name)} />
    </div>
  );
};

export default JobsPage;
