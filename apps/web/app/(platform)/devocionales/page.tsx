// apps/web/app/(platform)/devocionales/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';

const DevotionalsPage = () => {
  const role = useAuthStore((state) => state.user?.role);
  const canCreate = role === 'LEADER' || role === 'ADMIN' || role === 'DEVELOPER';
  const today = useQuery({
    queryKey: ['devotional-today'],
    queryFn: async () => (await api.get('/api/devotionals/today')).data.data,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Cada día"
        title="Devocionales"
        description="Un espacio diario para meditar la Palabra."
        action={
          canCreate ? (
            <Link className="text-sm font-semibold text-teal" href="/admin/devocional/nuevo">
              Crear
            </Link>
          ) : null
        }
      />
      {today.isLoading ? <Skeleton className="h-40" /> : null}
      {!today.isLoading && today.data ? (
        <Card className="bg-teal-dark text-cream">
          <h2 className="font-display text-2xl">{today.data.title}</h2>
          <p className="mt-2 text-cream/75">{today.data.verse}</p>
          <Link
            className="mt-4 inline-flex rounded-xl bg-gold px-4 py-2 text-sm font-semibold text-ink hover:bg-gold-light"
            href={`/devocionales/${today.data.id}`}
          >
            Participar hoy
          </Link>
        </Card>
      ) : null}
      {!today.isLoading && !today.data ? (
        <EmptyState
          icon="sun"
          title="Sin devocional hoy"
          description="Todavía no hay un devocional publicado para este día."
        />
      ) : null}
    </div>
  );
};

export default DevotionalsPage;
