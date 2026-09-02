// apps/web/app/(worship)/worship/dashboard/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { StatCard } from '@/components/dashboard/StatCard';
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
      <h1 className="font-display text-3xl text-teal">Ministerio de Alabanza</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Canciones" value={songs.data?.length ?? 0} />
        <StatCard label="Ensayos" value={rehearsals.data?.length ?? 0} />
        <StatCard label="Audiciones" value={auditions.data?.length ?? 0} />
      </div>
      <div className="flex gap-3 text-teal">
        <Link href="/worship/repertorio">Repertorio</Link>
        <Link href="/worship/ensayos">Ensayos</Link>
        <Link href="/worship/audiciones">Audiciones</Link>
      </div>
    </div>
  );
};

export default WorshipDashboardPage;
