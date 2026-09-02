// apps/web/app/(admin)/admin/ministerios/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

const MinistriesPage = () => {
  const query = useQuery({
    queryKey: ['ministries'],
    queryFn: async () => (await api.get('/api/ministries')).data.data,
  });
  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl text-teal">Ministerios</h1>
      {query.data?.map((item: { id: string; name: string; type: string }) => (
        <Link key={item.id} href={`/admin/ministerios/${item.id}`}>
          <Card>
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-slate-500">{item.type}</p>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default MinistriesPage;
