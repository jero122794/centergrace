// apps/web/components/layout/Topbar.tsx
'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Bell, LogOut, Menu, Search } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useUiStore } from '@/store/ui.store';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';

/**
 * Application top bar with menu, search, alerts and logout.
 */
export const Topbar = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const toggle = useUiStore((state) => state.toggleSidebar);
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const isDeveloper = pathname.startsWith('/developer');
  const isWorship = pathname.startsWith('/worship');
  const unread = useQuery({
    queryKey: ['notifications-unread'],
    queryFn: async () => (await api.get('/api/notifications/unread-count')).data.data as { count: number },
    enabled: Boolean(user),
    refetchInterval: 60_000,
  });
  const count = unread.data?.count ?? 0;

  const onSearch = (event: FormEvent): void => {
    event.preventDefault();
    const term = query.trim();
    if (term) {
      router.push(`/cursos?q=${encodeURIComponent(term)}`);
    }
  };

  return (
    <header
      className={`sticky top-0 z-20 flex h-[52px] items-center justify-between gap-3 border-b bg-paper px-4 md:h-14 lg:h-16 ${
        isWorship ? 'border-worship/30' : isDeveloper ? 'border-dev/30' : 'border-border'
      }`}
    >
      <div className="flex min-w-0 items-center gap-3">
        {isDeveloper ? null : (
          <Button variant="icon" className="lg:hidden" onClick={toggle} aria-label="Abrir menú">
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <div className="min-w-0">
          {isDeveloper ? (
            <div className="flex items-center gap-2">
              <p className="font-display text-lg text-dark">Panel Developer</p>
              <Badge className="bg-dev-l text-dev">DEV</Badge>
            </div>
          ) : isWorship ? (
            <p className="truncate font-display text-lg text-worship">Ministerio de Alabanza</p>
          ) : (
            <div className="hidden lg:block">
              <p className="truncate text-sm font-semibold text-dark">{user?.name}</p>
              <p className="text-xs capitalize text-muted">{user?.role.toLowerCase()}</p>
            </div>
          )}
        </div>
      </div>
      {isDeveloper ? (
        <div className="flex items-center gap-1">
          <Button variant="ghost" onClick={() => void logout()}>
            <LogOut className="h-4 w-4" />
            Salir
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-1">
          <form onSubmit={onSearch} className="relative hidden md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-hint" aria-hidden />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar cursos"
              aria-label="Buscar cursos"
              className="h-10 w-52 rounded-[10px] border-[1.5px] border-border bg-paper pl-9 pr-3 text-sm text-dark placeholder:text-hint focus:border-border-f focus:outline-none focus:ring-[3px] focus:ring-primary/30 lg:w-64"
            />
          </form>
          <Link
            href="/notificaciones"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-[10px] text-muted hover:bg-surface hover:text-accent"
            aria-label="Avisos"
          >
            <Bell className="h-5 w-5" />
            {count > 0 ? (
              <span className="absolute right-1 top-1 inline-flex min-h-3 min-w-3 items-center justify-center rounded-full bg-danger-d px-1 text-[9px] font-bold text-white">
                {count > 9 ? '9+' : count}
              </span>
            ) : null}
          </Link>
          <Button variant="ghost" onClick={() => void logout()}>
            <LogOut className="h-4 w-4" />
            Salir
          </Button>
        </div>
      )}
    </header>
  );
};
