// apps/web/app/(platform)/devocionales/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { DevotionalCard } from '@/components/devotional/DevotionalCard';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
import { formatLongDateBogota } from '@/lib/formatters';
import styles from './page.module.css';

const DevotionalsPage = () => {
  const role = useAuthStore((state) => state.user?.role);
  const canCreate = role === 'LEADER' || role === 'ADMIN' || role === 'DEVELOPER';
  const today = useQuery({
    queryKey: ['devotional-today'],
    queryFn: async () => (await api.get('/api/devotionals/today')).data.data,
  });

  return (
    <div className={styles.page}>
      <PageHeader
        kicker="Cada día"
        title="Devocionales"
        description="Un espacio diario para meditar la Palabra."
        action={
          canCreate ? (
            <Link className={styles.create} href="/admin/devocional/nuevo">
              Crear
            </Link>
          ) : null
        }
      />
      {today.isLoading ? <Skeleton /> : null}
      {!today.isLoading && today.data ? (
        <DevotionalCard
          title={today.data.title}
          verse={today.data.verse}
          dateLabel={formatLongDateBogota(today.data.date ?? new Date())}
          action={
            <Link href={`/devocionales/${today.data.id}`}>
              <Button>Participar hoy</Button>
            </Link>
          }
        />
      ) : null}
      {!today.isLoading && !today.data ? (
        <EmptyState title="Sin devocional hoy" description="Todavía no hay un devocional publicado para este día." />
      ) : null}
    </div>
  );
};

export default DevotionalsPage;
