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
import styles from './AppShell.module.css';

/**
 * Authenticated chrome: dark rail + linen canvas + mobile dock.
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
      <div className={styles.boot}>
        <Skeleton />
        <Skeleton lines={3} />
      </div>
    );
  }

  return (
    <div className={styles.shell}>
      {isDeveloper ? null : <Sidebar />}
      <div className={styles.column}>
        <Topbar />
        <main className={styles.main}>
          <PageWrapper>{children}</PageWrapper>
        </main>
      </div>
      {isDeveloper ? null : <BottomNav />}
    </div>
  );
};
