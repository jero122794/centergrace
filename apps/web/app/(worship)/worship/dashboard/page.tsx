// apps/web/app/(worship)/worship/dashboard/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { StatCard } from '@/components/dashboard/StatCard';
import { PageHeader } from '@/components/ui/PageHeader';
import Link from 'next/link';

const WorshipDashboardPage = () => {
  const songs = useQuery({ queryKey: ['songs'], queryFn: async () => (await api.get('/api/worship/songs')).data.data });
  const rehearsals = useQuery({
    queryKey: ['rehearsals'],
    queryFn: async () => (await api.get('/api/worship/rehearsals')).data.data,
  });
  const auditions = useQuery({
    queryKey: ['auditions'],
    queryFn: async () => (await api.get('/api/worship/auditions')).data.data,
  });

  return (
    <div className="space-y-4">
      <PageHeader kicker="Ministerio" title="Alabanza" description="Repertorio, ensayos, escuela y equipo." />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Canciones" value={songs.data?.length ?? 0} icon="music" />
        <StatCard label="Ensayos" value={rehearsals.data?.length ?? 0} icon="clock" />
        <StatCard label="Audiciones" value={auditions.data?.length ?? 0} icon="users" />
      </div>
      <div className="flex flex-wrap gap-3 text-sm font-semibold text-teal">
        <Link href="/worship/repertorio">Repertorio</Link>
        <Link href="/worship/ensayos">Ensayos</Link>
        <Link href="/worship/audiciones">Audiciones</Link>
        <Link href="/worship/escuela">Escuela</Link>
        <Link href="/worship/equipo">Equipo</Link>
      </div>
    </div>
  );
};

export default WorshipDashboardPage;
