// apps/web/app/(admin)/admin/reportes/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { StatCard } from '@/components/dashboard/StatCard';
import { PageHeader } from '@/components/ui/PageHeader';

const ReportsPage = () => {
  const query = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => (await api.get('/api/dashboard')).data.data,
  });
  return (
    <div className="space-y-4">
      <PageHeader kicker="Pastoreo" title="Reportes" description="Participación y formación en un vistazo." />
      <div className="grid gap-4 md:grid-cols-2">
        <StatCard label="Participaciones hoy" value={query.data?.participationsToday ?? 0} />
        <StatCard label="Cursos activos" value={query.data?.courses ?? 0} />
      </div>
    </div>
  );
};

export default ReportsPage;
