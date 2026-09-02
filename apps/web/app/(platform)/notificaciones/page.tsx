// apps/web/app/(platform)/notificaciones/page.tsx
'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
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
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-teal">Notificaciones</h1>
        <Button variant="secondary" onClick={() => markAll.mutate()} disabled={markAll.isPending}>
          Marcar todas como leídas
        </Button>
      </div>
      {query.isLoading ? <p>Cargando…</p> : null}
      {query.isError ? <p className="text-red-600">No se pudieron cargar las notificaciones.</p> : null}
      {!query.isLoading && query.data?.length === 0 ? (
        <p className="text-slate-500">No tienes notificaciones todavía.</p>
      ) : null}
      {query.data?.map((item) => (
        <Card key={item.id} className={item.readAt ? 'opacity-70' : ''}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-slate-600">{item.body}</p>
              <p className="mt-1 text-xs text-slate-400">{formatDateTimeBogota(item.createdAt)}</p>
              {item.url ? (
                <Link className="mt-2 inline-block text-sm text-teal" href={item.url} onClick={() => markOne.mutate(item.id)}>
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
