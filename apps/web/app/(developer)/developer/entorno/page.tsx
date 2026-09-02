// apps/web/app/(developer)/developer/entorno/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { EnvChecker, type EnvFlag } from '@/components/developer/EnvChecker';
import { PageHeader } from '@/components/ui/PageHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import stack from '@/components/ui/PageStack.module.css';

const EnvPage = () => {
  const query = useQuery({
    queryKey: ['dev-env'],
    queryFn: async () => (await api.get('/api/developer/env-check')).data.data as EnvFlag[],
  });
  return (
    <div className={stack.tight}>
      <PageHeader kicker="Sistema" title="Variables de entorno" description="Solo presencia o ausencia, nunca valores." />
      {query.isLoading ? <Skeleton lines={2} /> : null}
      <EnvChecker items={query.data ?? []} />
    </div>
  );
};

export default EnvPage;
