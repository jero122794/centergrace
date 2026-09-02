// apps/web/app/(admin)/admin/reportes/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { StatCard } from '@/components/dashboard/StatCard';
import { PageHeader } from '@/components/ui/PageHeader';
import stack from '@/components/ui/PageStack.module.css';

const ReportsPage = () => {
  const query = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => (await api.get('/api/dashboard')).data.data,
  });
  return (
    <div className={stack.tight}>
      <PageHeader kicker="Pastoreo" title="Reportes" description="Participación y formación en un vistazo." />
      <div className={stack.grid2}>
        <StatCard label="Participaciones hoy" value={query.data?.participationsToday ?? 0} />
        <StatCard label="Cursos activos" value={query.data?.courses ?? 0} />
      </div>
    </div>
  );
};

export default ReportsPage;
