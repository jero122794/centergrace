// apps/web/app/(platform)/dashboard/page.tsx
'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuthStore } from '@/store/auth.store';
import { formatGreetingDate } from '@/lib/formatters';

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
  const isStudent = user?.role === 'STUDENT';

  return (
    <div className="space-y-6">
      <PageHeader
        kicker={formatGreetingDate(new Date())}
        title={`Hola, ${user?.name ?? ''}`}
        description="Centro Misionero Shalom — tu espacio de formación y servicio."
      />
      {dashboard.isLoading ? (
        <Skeleton lines={1} className="h-28" />
      ) : isStudent ? (
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Cursos" value={dashboard.data?.enrollments ?? 0} icon="book" />
          <StatCard label="Racha" value={dashboard.data?.streak ?? 0} icon="spark" />
          <StatCard label="Última nota" value={dashboard.data?.lastGrade?.score ?? '—'} icon="clipboard" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Usuarios" value={dashboard.data?.users ?? 0} icon="users" />
          <StatCard label="Cursos" value={dashboard.data?.courses ?? 0} icon="book" />
          <StatCard label="Participaciones hoy" value={dashboard.data?.participationsToday ?? 0} icon="sun" />
        </div>
      )}
      <Card className="overflow-hidden bg-teal-dark text-cream">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-light">Devocional de hoy</p>
        {today.isLoading ? (
          <p className="mt-3 text-cream/70">Cargando…</p>
        ) : today.data ? (
          <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-display text-2xl">{today.data.title}</h2>
              {today.data.verse ? <p className="mt-2 text-cream/75">{today.data.verse}</p> : null}
            </div>
            <Link
              href={`/devocionales/${today.data.id}`}
              className="inline-flex rounded-xl bg-gold px-4 py-2 text-sm font-semibold text-ink hover:bg-gold-light"
            >
              Participar
            </Link>
          </div>
        ) : (
          <p className="mt-3 text-cream/70">No hay devocional publicado para hoy.</p>
        )}
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/cursos" className="block">
          <Card className="h-full transition hover:shadow-lift">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-dark">Continuar</p>
            <h3 className="mt-2 font-display text-xl text-teal">Tus cursos</h3>
            <p className="mt-1 text-sm text-ink/60">Entra a las lecciones y sigue tu progreso.</p>
          </Card>
        </Link>
        <Link href="/notificaciones" className="block">
          <Card className="h-full transition hover:shadow-lift">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-dark">Comunidad</p>
            <h3 className="mt-2 font-display text-xl text-teal">Avisos</h3>
            <p className="mt-1 text-sm text-ink/60">Revisa mensajes de tus líderes y de la iglesia.</p>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;
