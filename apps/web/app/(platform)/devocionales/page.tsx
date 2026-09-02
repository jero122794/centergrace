// apps/web/app/(platform)/devocionales/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

const DevotionalsPage = () => {
  const today = useQuery({
    queryKey: ['devotional-today'],
    queryFn: async () => (await api.get('/api/devotionals/today')).data.data,
  });

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl text-teal">Devocionales</h1>
      <Card>
        {today.data ? (
          <div>
            <h2 className="font-display text-2xl">{today.data.title}</h2>
            <p className="mt-2 text-slate-600">{today.data.verse}</p>
            <Link className="mt-4 inline-block text-teal" href={`/devocionales/${today.data.id}`}>
              Participar hoy
            </Link>
          </div>
        ) : (
          <p>No hay un devocional publicado para hoy.</p>
        )}
      </Card>
    </div>
  );
};

export default DevotionalsPage;
