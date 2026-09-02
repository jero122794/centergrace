// apps/web/app/(admin)/admin/ministerios/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { StatCard } from '@/components/dashboard/StatCard';
import { PageHeader } from '@/components/ui/PageHeader';
import stack from '@/components/ui/PageStack.module.css';

const MinistryDetailPage = () => {
  const params = useParams<{ id: string }>();
  const ministry = useQuery({
    queryKey: ['ministry', params.id],
    queryFn: async () => (await api.get(`/api/ministries/${params.id}`)).data.data,
  });
  const stats = useQuery({
    queryKey: ['ministry-stats', params.id],
    queryFn: async () => (await api.get(`/api/ministries/${params.id}/stats`)).data.data,
  });
  return (
    <div className={stack.tight}>
      <PageHeader title={ministry.data?.name ?? 'Ministerio'} description={ministry.data?.description} />
      <div className={stack.grid3}>
        <StatCard label="Miembros" value={stats.data?.members ?? 0} />
        <StatCard label="Ensayos" value={stats.data?.rehearsals ?? 0} />
        <StatCard label="Audiciones" value={stats.data?.pendingAuditions ?? 0} />
      </div>
    </div>
  );
};

export default MinistryDetailPage;
