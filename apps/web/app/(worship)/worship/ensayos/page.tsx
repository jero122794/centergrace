// apps/web/app/(worship)/worship/ensayos/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { RehearsalCard } from '@/components/worship/RehearsalCard';
import { PageHeader } from '@/components/ui/PageHeader';
import Link from 'next/link';

const RehearsalsPage = () => {
  const query = useQuery({
    queryKey: ['rehearsals'],
    queryFn: async () => (await api.get('/api/worship/rehearsals')).data.data,
  });
  return (
    <div className="space-y-4">
      <PageHeader
        kicker="Alabanza"
        title="Ensayos"
        action={
          <Link className="text-sm font-semibold text-worship" href="/worship/ensayos/nuevo">
            Nuevo
          </Link>
        }
      />
      {query.data?.map((item: { id: string; date: string; location?: string }) => (
        <Link key={item.id} href={`/worship/ensayos/${item.id}`} className="block">
          <RehearsalCard date={item.date} location={item.location} />
        </Link>
      ))}
    </div>
  );
};

export default RehearsalsPage;
