// apps/web/app/(worship)/worship/equipo/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

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
      <h1 className="font-display text-3xl text-teal">Equipo</h1>
      {query.isLoading ? <p>Cargando equipo…</p> : null}
      {query.isError ? <p className="text-red-600">No se pudo cargar el equipo.</p> : null}
      {!query.isLoading && query.data?.length === 0 ? (
        <p className="text-slate-500">Aún no hay miembros con rol musical asignado.</p>
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
