// apps/web/components/layout/AppShell.tsx
'use client';

import { useEffect, type ReactNode } from 'react';
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

  useEffect(() => {
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
  }, [user, token, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col pb-16 lg:pb-0">
        <Topbar />
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
};
