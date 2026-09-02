// apps/web/components/layout/Topbar.tsx
'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { useUiStore } from '@/store/ui.store';
import { Button } from '@/components/ui/Button';
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
    <header className="flex items-center justify-between border-b border-teal/10 bg-white px-4 py-3">
      <button className="rounded-lg px-2 py-1 lg:hidden" onClick={toggle} aria-label="Abrir menú">
        ☰
      </button>
      <p className="hidden font-medium lg:block">{user?.name}</p>
      <div className="flex items-center gap-2">
        <Link
          href="/notificaciones"
          className="relative rounded-xl px-3 py-2 text-sm font-semibold text-teal hover:bg-cream"
        >
          Avisos
          {count > 0 ? (
            <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] text-white">
              {count > 9 ? '9+' : count}
            </span>
          ) : null}
        </Link>
        <Button variant="ghost" onClick={() => void logout()}>
          Salir
        </Button>
      </div>
    </header>
  );
};
