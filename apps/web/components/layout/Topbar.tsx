// apps/web/components/layout/Topbar.tsx
'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { useUiStore } from '@/store/ui.store';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { api } from '@/lib/api';

export const Topbar = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const toggle = useUiStore((state) => state.toggleSidebar);
  const unread = useQuery({
    queryKey: ['notifications-unread'],
    queryFn: async () => (await api.get('/api/notifications/unread-count')).data.data as { count: number },
    enabled: Boolean(user),
    refetchInterval: 60_000,
  });
  const count = unread.data?.count ?? 0;

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-teal/10 bg-surface/85 px-4 py-3 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button className="rounded-lg p-2 text-teal lg:hidden" onClick={toggle} aria-label="Abrir menú">
          <Icon name="menu" />
        </button>
        <div className="hidden lg:block">
          <p className="text-sm font-semibold text-ink">{user?.name}</p>
          <p className="text-xs capitalize text-ink/50">{user?.role.toLowerCase()}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/notificaciones"
          className="relative inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-teal hover:bg-teal-mist"
        >
          <Icon name="bell" className="h-4 w-4" />
          Avisos
          {count > 0 ? (
            <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] text-white">
              {count > 9 ? '9+' : count}
            </span>
          ) : null}
        </Link>
        <Button variant="ghost" onClick={() => void logout()}>
          <Icon name="logout" className="h-4 w-4" />
          Salir
        </Button>
      </div>
    </header>
  );
};
