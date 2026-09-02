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
import styles from './Topbar.module.css';

/**
 * Sticky linen bar: section title, search, alerts, logout.
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
    <header className={styles.bar}>
      <div className={styles.left}>
        {isDeveloper ? null : (
          <Button variant="icon" onClick={toggle} aria-label="Abrir menú">
            <Menu width={20} height={20} />
          </Button>
        )}
        <div>
          {isDeveloper ? (
            <>
              <p className={styles.title}>Panel Developer</p>
              <Badge tone="developer">DEV</Badge>
            </>
          ) : isWorship ? (
            <p className={styles.title}>Ministerio de Alabanza</p>
          ) : (
            <div className={styles.desktopOnly}>
              <p className={styles.title}>{user?.name}</p>
              <p className={styles.meta}>{user?.role.toLowerCase()}</p>
            </div>
          )}
        </div>
      </div>
      <div className={styles.right}>
        {isDeveloper ? null : (
          <>
            <form onSubmit={onSearch} className={styles.search}>
              <Search aria-hidden />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar cursos"
                aria-label="Buscar cursos"
              />
            </form>
            <Link href="/notificaciones" className={styles.bell} aria-label="Avisos">
              <Bell width={20} height={20} />
              {count > 0 ? <span className={styles.count}>{count > 9 ? '9+' : count}</span> : null}
            </Link>
          </>
        )}
        <Button variant="ghost" onClick={() => void logout()}>
          <LogOut width={16} height={16} />
          Salir
        </Button>
      </div>
    </header>
  );
};
