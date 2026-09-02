// apps/web/app/(platform)/perfil/page.tsx
'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/ui/PageHeader';
import { Alert } from '@/components/ui/Alert';
import { isPushSupported, subscribeToPush, unsubscribeFromPush } from '@/lib/push';
import { api } from '@/lib/api';
import stack from '@/components/ui/PageStack.module.css';

const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);
  const client = useQueryClient();
  const [message, setMessage] = useState<string | null>(null);
  const status = useQuery({
    queryKey: ['push-status'],
    queryFn: async () => (await api.get('/api/notifications/push-status')).data.data as { subscribed: boolean },
  });
  const subscribe = useMutation({
    mutationFn: subscribeToPush,
    onSuccess: () => {
      setMessage('Notificaciones activadas en este dispositivo.');
      void client.invalidateQueries({ queryKey: ['push-status'] });
    },
    onError: (error: Error) => setMessage(error.message),
  });
  const unsubscribe = useMutation({
    mutationFn: unsubscribeFromPush,
    onSuccess: () => {
      setMessage('Notificaciones desactivadas.');
      void client.invalidateQueries({ queryKey: ['push-status'] });
    },
  });

  return (
    <div className={stack.page}>
      <PageHeader kicker="Cuenta" title="Perfil" description="Tu identidad en la plataforma y las alertas de este dispositivo." />
      <Card className={stack.list}>
        <p className={stack.title}>{user?.name}</p>
        <p className={stack.muted}>{user?.email}</p>
        <p className={stack.muted}>
          Rol: <Badge>{user?.role ?? ''}</Badge>
        </p>
        <div className={stack.actions}>
          <span className={stack.muted}>Push</span>
          <Badge tone={status.data?.subscribed ? 'teal' : 'neutral'}>
            {status.data?.subscribed ? 'activo' : 'inactivo'}
          </Badge>
        </div>
        {!isPushSupported() ? (
          <Alert tone="info">
            Web Push requiere HTTPS (o localhost) y un service worker de producción. En desarrollo HTTP las alertas
            siguen llegando al centro de notificaciones.
          </Alert>
        ) : null}
        <div className={stack.actions}>
          <Button type="button" onClick={() => subscribe.mutate()} disabled={subscribe.isPending}>
            Activar notificaciones
          </Button>
          <Button type="button" variant="secondary" onClick={() => unsubscribe.mutate()}>
            Desactivar
          </Button>
        </div>
        {message ? <p className={stack.muted}>{message}</p> : null}
      </Card>
    </div>
  );
};

export default ProfilePage;
