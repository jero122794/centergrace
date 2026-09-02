// apps/web/app/(worship)/worship/equipo/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { Alert } from '@/components/ui/Alert';

interface TeamMember {
  musicalRole: string;
  joinedAt: string;
  user: { id: string; name: string; email: string };
  ministry: { id: string; name: string };
}

const TeamPage = () => {
  const query = useQuery({
    queryKey: ['worship-team'],
    queryFn: async () => (await api.get('/api/worship/team')).data.data as TeamMember[],
  });

  return (
    <div className="space-y-4">
      <PageHeader kicker="Alabanza" title="Equipo" description="Miembros con rol musical asignado." />
      {query.isLoading ? <Skeleton lines={2} /> : null}
      {query.isError ? <Alert>No se pudo cargar el equipo.</Alert> : null}
      {!query.isLoading && query.data?.length === 0 ? (
        <EmptyState title="Equipo vacío" description="Aún no hay miembros con rol musical asignado." />
      ) : null}
      {query.data?.map((item) => (
        <Card key={`${item.user.id}-${item.ministry.id}`} className="flex items-center justify-between">
          <div>
            <p className="font-medium">{item.user.name}</p>
            <p className="text-sm text-slate-500">{item.ministry.name}</p>
          </div>
          <Badge>{item.musicalRole}</Badge>
        </Card>
      ))}
    </div>
  );
};

export default TeamPage;
