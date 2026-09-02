// apps/web/components/layout/AppShell.tsx
'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { BottomNav } from './BottomNav';
import { PageWrapper } from './PageWrapper';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuthStore } from '@/store/auth.store';
import { setAccessToken } from '@/lib/api';

/**
 * Authenticated chrome: sidebar, topbar and mobile bottom nav.
 */
export const AppShell = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.accessToken);
  const [hydrated, setHydrated] = useState(false);
  const isDeveloper = pathname.startsWith('/developer');

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
      <div className="min-h-screen bg-bg p-6">
        <Skeleton className="mb-4 h-16" />
        <Skeleton lines={3} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-bg">
      {isDeveloper ? null : <Sidebar />}
      <div className="flex min-h-screen flex-1 flex-col pb-16 lg:pb-0">
        <Topbar />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <PageWrapper>{children}</PageWrapper>
        </main>
      </div>
      {isDeveloper ? null : <BottomNav />}
    </div>
  );
};
