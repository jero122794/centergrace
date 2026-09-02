// apps/web/app/(admin)/admin/dashboard/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { StatCard } from '@/components/dashboard/StatCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { Skeleton } from '@/components/ui/Skeleton';

const AdminDashboardPage = () => {
  const query = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => (await api.get('/api/dashboard')).data.data,
  });
  const data = query.data ?? {};
  return (
    <div className="space-y-6">
      <PageHeader kicker="Pastoreo" title="Panel" description="Vista general de la iglesia y la formación." />
      {query.isLoading ? (
        <Skeleton lines={2} />
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Usuarios" value={data.users ?? 0} icon="users" />
          <StatCard label="Ministerios" value={data.ministries ?? 0} icon="heart" />
          <StatCard label="Grupos" value={data.groups ?? 0} icon="users" />
          <StatCard label="Cursos" value={data.courses ?? 0} icon="book" />
          <StatCard label="Devocionales del mes" value={data.devotionals ?? 0} icon="sun" />
          <StatCard label="Participaciones hoy" value={data.participationsToday ?? 0} icon="spark" />
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
