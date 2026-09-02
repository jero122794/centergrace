// apps/web/app/(platform)/perfil/page.tsx
'use client';

import { useAuthStore } from '@/store/auth.store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { subscribeToPush } from '@/lib/push';

const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);
  return (
    <Card className="max-w-lg space-y-3">
      <h1 className="font-display text-3xl text-teal">Perfil</h1>
      <p>{user?.name}</p>
      <p className="text-sm text-slate-500">{user?.email}</p>
      <p className="text-sm">Rol: {user?.role}</p>
      <Button type="button" onClick={() => void subscribeToPush()}>
        Activar notificaciones
      </Button>
    </Card>
  );
};

export default ProfilePage;
