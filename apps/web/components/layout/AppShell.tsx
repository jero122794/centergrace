// apps/web/components/layout/AppShell.tsx
'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { BottomNav } from './BottomNav';
import { useAuthStore } from '@/store/auth.store';
import { setAccessToken } from '@/lib/api';

export const AppShell = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.accessToken);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const markReady = (): void => setHydrated(true);
    if (useAuthStore.persist.hasHydrated()) {
      markReady();
      return;
    }
    return useAuthStore.persist.onFinishHydration(markReady);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    if (token) {
      setAccessToken(token);
    }
    if (!user) {
      router.replace('/login');
      return;
    }
    if (user.mustChangePassword) {
      router.replace('/change-password');
    }
  }, [hydrated, user, token, router]);

  if (!hydrated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-ink/50">
        Cargando…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col pb-20 lg:pb-0">
        <Topbar />
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
};
