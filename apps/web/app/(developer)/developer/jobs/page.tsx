// apps/web/app/(developer)/developer/jobs/page.tsx
'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const JobsPage = () => {
  const client = useQueryClient();
  const query = useQuery({
    queryKey: ['dev-jobs'],
    queryFn: async () => (await api.get('/api/developer/jobs')).data.data,
  });
  const trigger = useMutation({
    mutationFn: async (name: string) => api.post(`/api/developer/jobs/${name}/trigger`),
    onSuccess: () => client.invalidateQueries({ queryKey: ['dev-jobs'] }),
  });

  return (
    <div className="space-y-3">
      <h1 className="font-display text-3xl text-teal">Cron jobs</h1>
      {query.data?.map((job: { name: string; expression: string }) => (
        <Card key={job.name} className="flex items-center justify-between">
          <div>
            <p className="font-medium">{job.name}</p>
            <p className="text-sm text-slate-500">{job.expression}</p>
          </div>
          <Button onClick={() => trigger.mutate(job.name)}>Ejecutar</Button>
        </Card>
      ))}
    </div>
  );
};

export default JobsPage;
