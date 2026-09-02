// apps/web/components/layout/Topbar.tsx
'use client';

import { useAuthStore } from '@/store/auth.store';
import { useUiStore } from '@/store/ui.store';
import { Button } from '@/components/ui/Button';

export const Topbar = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const toggle = useUiStore((state) => state.toggleSidebar);

  return (
    <header className="flex items-center justify-between border-b border-teal/10 bg-white px-4 py-3">
      <button className="rounded-lg px-2 py-1 lg:hidden" onClick={toggle} aria-label="Abrir menú">
        ☰
      </button>
      <p className="hidden font-medium lg:block">{user?.name}</p>
      <Button variant="ghost" onClick={() => void logout()}>
        Salir
      </Button>
    </header>
  );
};
