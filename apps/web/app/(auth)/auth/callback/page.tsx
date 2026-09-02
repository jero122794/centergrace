// apps/web/app/(auth)/auth/callback/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { api, setAccessToken } from '@/lib/api';
import { Suspense } from 'react';
import { Logo } from '@/components/brand/Logo';

const CallbackInner = () => {
  const params = useSearchParams();
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);

  useEffect(() => {
    const token = params.get('accessToken');
    if (!token) {
      router.replace('/login');
      return;
    }
    setAccessToken(token);
    void api.get('/api/auth/me').then((response) => {
      setSession(response.data.data, token);
      router.replace('/dashboard');
    });
  }, [params, router, setSession]);

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="rounded-[28px] border border-teal/10 bg-surface px-8 py-10 text-center shadow-card">
        <Logo className="justify-center" />
        <p className="mt-6 text-sm text-ink/60">Completando inicio de sesión…</p>
      </div>
    </main>
  );
};

const AuthCallbackPage = () => (
  <Suspense
    fallback={
      <main className="flex min-h-screen items-center justify-center p-6">
        <p className="text-sm text-ink/60">Cargando…</p>
      </main>
    }
  >
    <CallbackInner />
  </Suspense>
);

export default AuthCallbackPage;
