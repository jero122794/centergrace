// apps/web/app/(auth)/auth/callback/page.tsx
'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { api, setAccessToken } from '@/lib/api';
import { AuthShell } from '@/components/layout/AuthShell';
import stack from '@/components/ui/PageStack.module.css';

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
    <AuthShell title="Un momento" subtitle="Completando inicio de sesión…">
      <p className={stack.hint}>Te llevamos a tu casa.</p>
    </AuthShell>
  );
};

const AuthCallbackPage = () => (
  <Suspense
    fallback={
      <AuthShell title="Cargando" subtitle="Preparando tu sesión.">
        <span />
      </AuthShell>
    }
  >
    <CallbackInner />
  </Suspense>
);

export default AuthCallbackPage;
