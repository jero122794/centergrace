// apps/web/app/(admin)/admin/dashboard/page.tsx
'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, ClipboardList, Heart, Sun, Users } from 'lucide-react';
import { api } from '@/lib/api';
import { StatCard } from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '@/store/auth.store';
import { formatDateBogota } from '@/lib/formatters';

interface PendingSubmission {
  id: string;
  status: string;
  createdAt: string;
  user: { name: string };
  lesson: { title: string };
}

interface GroupItem {
  id: string;
  name: string;
  type: string;
  _count?: { memberships: number };
}

interface MinistryItem {
  id: string;
  name: string;
  type: string;
  isActive?: boolean;
}

const AdminDashboardPage = () => {
  const user = useAuthStore((state) => state.user);
  const query = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => (await api.get('/api/dashboard')).data.data,
  });
  const submissions = useQuery({
    queryKey: ['submissions'],
    queryFn: async () => (await api.get('/api/submissions')).data.data as PendingSubmission[],
    enabled: user?.role !== 'STUDENT',
  });
  const groups = useQuery({
    queryKey: ['groups'],
    queryFn: async () => (await api.get('/api/groups')).data.data as GroupItem[],
    enabled: user?.role === 'LEADER',
  });
  const ministries = useQuery({
    queryKey: ['ministries'],
    queryFn: async () => (await api.get('/api/ministries')).data.data as MinistryItem[],
    enabled: user?.role === 'ADMIN' || user?.role === 'DEVELOPER',
  });
  const data = query.data ?? {};
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'DEVELOPER';
  const pending = submissions.data?.filter((item) => item.status !== 'GRADED') ?? [];

  return (
    <div className="space-y-8">
      <PageHeader
        kicker={isAdmin ? 'Panel pastoral' : 'Panel de liderazgo'}
        title={isAdmin ? 'Centro Misionero Shalom' : `Hola, ${user?.name ?? ''}`}
        description={
          isAdmin
            ? 'Vista general de la iglesia y la formación.'
            : 'Acompaña a tu grupo, califica y publica contenido.'
        }
      />
      {query.isLoading ? (
        <Skeleton lines={2} />
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label={isAdmin ? 'Miembros activos' : 'Miembros'} value={data.users ?? 0} icon={Users} />
          <StatCard
            label="Entregas por calificar"
            value={pending.length}
            icon={ClipboardList}
            accent={pending.length > 0 ? 'danger' : 'accent'}
          />
          <StatCard label={isAdmin ? 'Cursos publicados' : 'Devocionales este mes'} value={isAdmin ? (data.courses ?? 0) : (data.devotionals ?? 0)} icon={isAdmin ? BookOpen : Sun} />
          <StatCard label="Participaciones hoy" value={data.participationsToday ?? 0} icon={Heart} accent="gold" />
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <Link href="/admin/devocional/nuevo">
          <Button variant="secondary">Crear devocional</Button>
        </Link>
        <Link href="/admin/contenido">
          <Button variant="secondary">Crear curso</Button>
        </Link>
        <Link href="/admin/grupos">
          <Button variant="secondary">Agregar miembro</Button>
        </Link>
      </div>
      {pending.length > 0 ? (
        <section>
          <div className="mb-3 flex items-center gap-2">
            <h2 className="font-display text-h2 text-dark">Entregas pendientes</h2>
            <Badge tone="danger">{String(pending.length)}</Badge>
          </div>
          <div className="space-y-2">
            {pending.slice(0, 6).map((item) => (
              <Card key={item.id} className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-dark">{item.user.name}</p>
                  <p className="text-sm text-muted">
                    {item.lesson.title} · {formatDateBogota(item.createdAt)}
                  </p>
                </div>
                <Link href="/admin/calificaciones">
                  <Button>Calificar</Button>
                </Link>
              </Card>
            ))}
          </div>
        </section>
      ) : null}
      {isAdmin && ministries.data ? (
        <section>
          <h2 className="mb-4 font-display text-h2 text-dark">Ministerios</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {ministries.data.map((item) => (
              <Card key={item.id} hover>
                <h3 className="font-display text-lg text-dark">{item.name}</h3>
                <p className="mt-1 text-sm text-muted">{item.type}</p>
                <Badge tone={item.isActive === false ? 'warm' : 'success'} className="mt-3">
                  {item.isActive === false ? 'Inactivo' : 'Activo'}
                </Badge>
                <div className="mt-4">
                  <Link href={`/admin/ministerios/${item.id}`}>
                    <Button variant="ghost">Gestionar</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </section>
      ) : null}
      {!isAdmin && groups.data ? (
        <section>
          <h2 className="mb-4 font-display text-h2 text-dark">Mis grupos</h2>
          <div className="space-y-3">
            {groups.data.map((item) => (
              <Card key={item.id} className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-dark">{item.name}</p>
                  <p className="text-sm text-muted">
                    {item.type} · {item._count?.memberships ?? 0} miembros
                  </p>
                </div>
                <Link href="/admin/grupos">
                  <Button variant="ghost">Ver grupo</Button>
                </Link>
              </Card>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default AdminDashboardPage;
