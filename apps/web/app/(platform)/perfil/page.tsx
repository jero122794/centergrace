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
    <div className="space-y-6">
      <PageHeader kicker="Cuenta" title="Perfil" description="Tu identidad en la plataforma y las alertas de este dispositivo." />
      <Card className="max-w-lg space-y-3">
        <p className="font-display text-2xl text-teal">{user?.name}</p>
        <p className="text-sm text-ink/55">{user?.email}</p>
        <p className="text-sm">
          Rol: <Badge>{user?.role ?? ''}</Badge>
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm">Push</span>
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
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={() => subscribe.mutate()} disabled={subscribe.isPending}>
            Activar notificaciones
          </Button>
          <Button type="button" variant="secondary" onClick={() => unsubscribe.mutate()}>
            Desactivar
          </Button>
        </div>
        {message ? <p className="text-sm text-ink/70">{message}</p> : null}
      </Card>
    </div>
  );
};

export default ProfilePage;
