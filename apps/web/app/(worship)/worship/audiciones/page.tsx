// apps/web/app/(worship)/worship/audiciones/page.tsx
'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/ui/PageHeader';

const AuditionsPage = () => {
  const client = useQueryClient();
  const query = useQuery({
    queryKey: ['auditions'],
    queryFn: async () => (await api.get('/api/worship/auditions')).data.data,
  });
  const approve = useMutation({
    mutationFn: async (id: string) =>
      api.patch(`/api/worship/auditions/${id}`, { status: 'APPROVED', musicalRole: 'VOCALIST' }),
    onSuccess: () => client.invalidateQueries({ queryKey: ['auditions'] }),
  });

  return (
    <div className="space-y-4">
      <PageHeader kicker="Alabanza" title="Audiciones" description="Aprueba postulaciones al equipo." />
      {query.data?.map((item: { id: string; status: string; user: { name: string } }) => (
        <Card key={item.id} className="flex items-center justify-between">
          <div>
            <p>{item.user.name}</p>
            <Badge>{item.status}</Badge>
          </div>
          <Button onClick={() => approve.mutate(item.id)}>Aprobar</Button>
        </Card>
      ))}
    </div>
  );
};

export default AuditionsPage;
