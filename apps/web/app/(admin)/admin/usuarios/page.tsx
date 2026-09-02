// apps/web/app/(admin)/admin/usuarios/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/ui/PageHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import stack from '@/components/ui/PageStack.module.css';

const UsersPage = () => {
  const query = useQuery({
    queryKey: ['users'],
    queryFn: async () => (await api.get('/api/users')).data.data,
  });
  return (
    <div className={stack.tight}>
      <PageHeader kicker="Iglesia" title="Usuarios" description="Miembros y roles de la plataforma." />
      {query.isLoading ? <Skeleton lines={3} /> : null}
      {query.data?.map((user: { id: string; name: string; email: string; role: string; isActive: boolean }) => (
        <Card key={user.id} className={stack.row}>
          <div>
            <p className={stack.name}>{user.name}</p>
            <p className={stack.muted}>{user.email}</p>
          </div>
          <Badge>{user.role}</Badge>
        </Card>
      ))}
    </div>
  );
};

export default UsersPage;
