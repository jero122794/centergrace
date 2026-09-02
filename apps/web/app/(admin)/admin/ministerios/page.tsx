// apps/web/app/(admin)/admin/ministerios/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import Link from 'next/link';
import stack from '@/components/ui/PageStack.module.css';

const MinistriesPage = () => {
  const query = useQuery({
    queryKey: ['ministries'],
    queryFn: async () => (await api.get('/api/ministries')).data.data,
  });
  return (
    <div className={stack.tight}>
      <PageHeader kicker="Iglesia" title="Ministerios" />
      {query.data?.map((item: { id: string; name: string; type: string }) => (
        <Link key={item.id} href={`/admin/ministerios/${item.id}`}>
          <Card>
            <p className={stack.name}>{item.name}</p>
            <p className={stack.muted}>{item.type}</p>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default MinistriesPage;
