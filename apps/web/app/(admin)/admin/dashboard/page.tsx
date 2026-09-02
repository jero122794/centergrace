// apps/web/app/(admin)/admin/dashboard/page.tsx
'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, ClipboardList, Heart, Sun, Users } from 'lucide-react';
import { api } from '@/lib/api';
import { Ledger, StatCard } from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '@/store/auth.store';
import { formatDateBogota } from '@/lib/formatters';
import styles from './page.module.css';

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
    <div className={styles.page}>
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
        <Ledger>
          <StatCard label={isAdmin ? 'Miembros activos' : 'Miembros'} value={data.users ?? 0} icon={Users} />
          <StatCard
            label="Entregas por calificar"
            value={pending.length}
            icon={ClipboardList}
            accent={pending.length > 0 ? 'danger' : 'accent'}
            enterDelay={60}
          />
          <StatCard
            label={isAdmin ? 'Cursos publicados' : 'Devocionales este mes'}
            value={isAdmin ? (data.courses ?? 0) : (data.devotionals ?? 0)}
            icon={isAdmin ? BookOpen : Sun}
            enterDelay={120}
          />
          <StatCard label="Participaciones hoy" value={data.participationsToday ?? 0} icon={Heart} accent="gold" enterDelay={180} />
        </Ledger>
      )}
      <div className={styles.actions}>
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
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Entregas pendientes</h2>
            <Badge tone="danger">{String(pending.length)}</Badge>
          </div>
          <div className={styles.list}>
            {pending.slice(0, 6).map((item, index) => (
              <Card key={item.id} enterDelay={index * 60}>
                <div className={styles.row}>
                  <div>
                    <p className={styles.name}>{item.user.name}</p>
                    <p className={styles.meta}>
                      {item.lesson.title} · {formatDateBogota(item.createdAt)}
                    </p>
                  </div>
                  <Link href="/admin/calificaciones">
                    <Button>Calificar</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </section>
      ) : null}
      {isAdmin && ministries.data ? (
        <section>
          <h2 className={styles.sectionTitle}>Ministerios</h2>
          <div className={styles.grid}>
            {ministries.data.map((item, index) => (
              <Card key={item.id} hover enterDelay={index * 60}>
                <h3 className={styles.ministryTitle}>{item.name}</h3>
                <p className={styles.ministryMeta}>{item.type}</p>
                <div className={styles.badge}>
                  <Badge tone={item.isActive === false ? 'warm' : 'success'}>
                    {item.isActive === false ? 'Inactivo' : 'Activo'}
                  </Badge>
                </div>
                <div className={styles.manage}>
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
          <h2 className={styles.sectionTitle}>Mis grupos</h2>
          <div className={styles.list}>
            {groups.data.map((item, index) => (
              <Card key={item.id} enterDelay={index * 60}>
                <div className={styles.row}>
                  <div>
                    <p className={styles.name}>{item.name}</p>
                    <p className={styles.meta}>
                      {item.type} · {item._count?.memberships ?? 0} miembros
                    </p>
                  </div>
                  <Link href="/admin/grupos">
                    <Button variant="ghost">Ver grupo</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default AdminDashboardPage;
