// apps/web/app/(worship)/worship/dashboard/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { Clock3, Music, Users } from 'lucide-react';
import { api } from '@/lib/api';
import { StatCard } from '@/components/dashboard/StatCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { AuditionStepper, type AuditionStep } from '@/components/worship/AuditionStepper';
import { Button } from '@/components/ui/Button';
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
  const school = useQuery({
    queryKey: ['worship-school'],
    queryFn: async () => (await api.get('/api/worship/school')).data.data as { canAudition?: boolean },
  });
  const step: AuditionStep = school.data?.canAudition ? 'ELIGIBLE' : 'SCHOOL';

  return (
    <div className="space-y-8">
      <PageHeader kicker="Ministerio" title="Alabanza" description="Repertorio, ensayos, escuela y equipo." />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Canciones" value={songs.data?.length ?? 0} icon={Music} accent="worship" />
        <StatCard label="Ensayos" value={rehearsals.data?.length ?? 0} icon={Clock3} accent="worship" />
        <StatCard label="Audiciones" value={auditions.data?.length ?? 0} icon={Users} accent="worship" />
      </div>
      <section className="space-y-3">
        <h2 className="font-display text-h2 text-dark">Ruta de ingreso</h2>
        <AuditionStepper current={step} />
        {step === 'ELIGIBLE' ? (
          <Link href="/worship/audiciones">
            <Button>Solicitar audición</Button>
          </Link>
        ) : (
          <Link href="/worship/escuela" className="text-sm font-semibold text-worship">
            Continuar la escuela
          </Link>
        )}
      </section>
      <div className="flex flex-wrap gap-3 text-sm font-semibold text-worship">
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
