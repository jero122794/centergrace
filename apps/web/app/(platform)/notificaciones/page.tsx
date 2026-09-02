// apps/web/app/(platform)/notificaciones/page.tsx
'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { Alert } from '@/components/ui/Alert';
import { formatDateTimeBogota } from '@/lib/formatters';
import stack from '@/components/ui/PageStack.module.css';

interface InAppNotification {
  id: string;
  title: string;
  body: string;
  url?: string | null;
  readAt?: string | null;
  createdAt: string;
}

const NotificationsPage = () => {
  const client = useQueryClient();
  const query = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => (await api.get('/api/notifications')).data.data as InAppNotification[],
  });
  const markAll = useMutation({
    mutationFn: async () => api.patch('/api/notifications/read-all'),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ['notifications'] });
      void client.invalidateQueries({ queryKey: ['notifications-unread'] });
    },
  });
  const markOne = useMutation({
    mutationFn: async (id: string) => api.patch(`/api/notifications/${id}/read`),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ['notifications'] });
      void client.invalidateQueries({ queryKey: ['notifications-unread'] });
    },
  });

  return (
    <div className={stack.tight}>
      <PageHeader
        kicker="Comunidad"
        title="Notificaciones"
        action={
          <Button variant="secondary" onClick={() => markAll.mutate()} disabled={markAll.isPending}>
            Marcar todas como leídas
          </Button>
        }
      />
      {query.isLoading ? <Skeleton lines={3} /> : null}
      {query.isError ? <Alert>No se pudieron cargar las notificaciones.</Alert> : null}
      {!query.isLoading && query.data?.length === 0 ? (
        <EmptyState title="Sin avisos" description="Cuando haya mensajes de la iglesia, aparecerán aquí." />
      ) : null}
      {query.data?.map((item) => (
        <Card key={item.id} className={item.readAt ? stack.dim : undefined}>
          <div className={stack.row}>
            <div>
              <p className={stack.name}>{item.title}</p>
              <p className={stack.muted}>{item.body}</p>
              <p className={stack.muted}>{formatDateTimeBogota(item.createdAt)}</p>
              {item.url ? (
                <Link className={stack.link} href={item.url} onClick={() => markOne.mutate(item.id)}>
                  Abrir
                </Link>
              ) : null}
            </div>
            {!item.readAt ? (
              <Button variant="ghost" onClick={() => markOne.mutate(item.id)}>
                Leída
              </Button>
            ) : null}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default NotificationsPage;
