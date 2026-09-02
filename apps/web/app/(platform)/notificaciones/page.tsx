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
    <div className="space-y-4">
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
        <Card key={item.id} className={item.readAt ? 'opacity-70' : ''}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-ink/65">{item.body}</p>
              <p className="mt-1 text-xs text-ink/40">{formatDateTimeBogota(item.createdAt)}</p>
              {item.url ? (
                <Link className="mt-2 inline-block text-sm text-accent" href={item.url} onClick={() => markOne.mutate(item.id)}>
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
