// apps/web/components/layout/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore, type Role } from '@/store/auth.store';
import { useUiStore } from '@/store/ui.store';

interface NavItem {
  href: string;
  label: string;
  roles: Role[];
}

const NAV: NavItem[] = [
  { href: '/dashboard', label: 'Inicio', roles: ['STUDENT', 'LEADER', 'ADMIN', 'DEVELOPER'] },
  { href: '/cursos', label: 'Cursos', roles: ['STUDENT', 'LEADER', 'ADMIN', 'DEVELOPER'] },
  { href: '/devocionales', label: 'Devocionales', roles: ['STUDENT', 'LEADER', 'ADMIN', 'DEVELOPER'] },
  { href: '/mis-trabajos', label: 'Mis trabajos', roles: ['STUDENT'] },
  { href: '/mi-historial', label: 'Historial', roles: ['STUDENT'] },
  { href: '/admin/dashboard', label: 'Admin', roles: ['LEADER', 'ADMIN', 'DEVELOPER'] },
  { href: '/admin/grupos', label: 'Grupos', roles: ['LEADER', 'ADMIN', 'DEVELOPER'] },
  { href: '/admin/usuarios', label: 'Usuarios', roles: ['ADMIN', 'DEVELOPER'] },
  { href: '/admin/contenido', label: 'Contenido', roles: ['LEADER', 'ADMIN', 'DEVELOPER'] },
  { href: '/admin/calificaciones', label: 'Calificaciones', roles: ['LEADER', 'ADMIN', 'DEVELOPER'] },
  { href: '/worship/dashboard', label: 'Alabanza', roles: ['LEADER', 'ADMIN', 'DEVELOPER'] },
  { href: '/developer/sistema', label: 'Developer', roles: ['DEVELOPER'] },
  { href: '/perfil', label: 'Perfil', roles: ['STUDENT', 'LEADER', 'ADMIN', 'DEVELOPER'] },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const open = useUiStore((state) => state.sidebarOpen);
  const close = useUiStore((state) => state.closeSidebar);
  const items = NAV.filter((item) => user && item.roles.includes(user.role));

  return (
    <>
      {open ? <button className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={close} aria-label="Cerrar menú" /> : null}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 border-r border-teal/10 bg-white p-4 transition-transform lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <p className="font-display text-xl text-teal">Shalom</p>
        <p className="mb-6 text-xs text-slate-500">Centro Misionero</p>
        <nav className="space-y-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              className={`block rounded-xl px-3 py-2 text-sm ${
                pathname.startsWith(item.href) ? 'bg-teal text-white' : 'text-ink hover:bg-cream'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};
