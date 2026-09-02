// apps/web/app/(worship)/worship/ensayos/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { formatDateTimeBogota } from '@/lib/formatters';
import Link from 'next/link';

const RehearsalsPage = () => {
  const query = useQuery({
    queryKey: ['rehearsals'],
    queryFn: async () => (await api.get('/api/worship/rehearsals')).data.data,
  });
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-teal">Ensayos</h1>
        <Link className="text-teal" href="/worship/ensayos/nuevo">
          Nuevo
        </Link>
      </div>
      {query.data?.map((item: { id: string; date: string; location?: string }) => (
        <Link key={item.id} href={`/worship/ensayos/${item.id}`}>
          <Card>
            <p>{formatDateTimeBogota(item.date)}</p>
            <p className="text-sm text-slate-500">{item.location}</p>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default RehearsalsPage;
