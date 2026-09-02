// apps/web/app/(admin)/admin/dashboard/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { StatCard } from '@/components/dashboard/StatCard';

const AdminDashboardPage = () => {
  const query = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => (await api.get('/api/dashboard')).data.data,
  });
  const data = query.data ?? {};
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard label="Usuarios" value={data.users ?? 0} />
      <StatCard label="Ministerios" value={data.ministries ?? 0} />
      <StatCard label="Grupos" value={data.groups ?? 0} />
      <StatCard label="Cursos" value={data.courses ?? 0} />
      <StatCard label="Devocionales del mes" value={data.devotionals ?? 0} />
      <StatCard label="Participaciones hoy" value={data.participationsToday ?? 0} />
    </div>
  );
};

export default AdminDashboardPage;
