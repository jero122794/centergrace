// apps/web/app/(platform)/dashboard/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/store/auth.store';

const DashboardPage = () => {
  const user = useAuthStore((state) => state.user);
  const dashboard = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => (await api.get('/api/dashboard')).data.data,
  });
  const today = useQuery({
    queryKey: ['devotional-today'],
    queryFn: async () => (await api.get('/api/devotionals/today')).data.data,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-teal">Hola, {user?.name}</h1>
        <p className="text-slate-500">Centro Misionero Shalom</p>
      </div>
      {user?.role === 'STUDENT' ? (
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Cursos" value={dashboard.data?.enrollments ?? 0} />
          <StatCard label="Racha" value={dashboard.data?.streak ?? 0} />
          <StatCard label="Última nota" value={dashboard.data?.lastGrade?.score ?? '—'} />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Usuarios" value={dashboard.data?.users ?? 0} />
          <StatCard label="Cursos" value={dashboard.data?.courses ?? 0} />
          <StatCard label="Participaciones hoy" value={dashboard.data?.participationsToday ?? 0} />
        </div>
      )}
      <Card>
        <h2 className="font-display text-xl">Devocional de hoy</h2>
        {today.data ? <p className="mt-2">{today.data.title}</p> : <p className="mt-2 text-slate-500">No hay devocional publicado para hoy.</p>}
      </Card>
    </div>
  );
};

export default DashboardPage;
