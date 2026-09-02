// apps/web/components/layout/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/brand/Logo';
import { Icon, type IconName } from '@/components/ui/Icon';
import { useAuthStore, type Role } from '@/store/auth.store';
import { useUiStore } from '@/store/ui.store';

interface NavItem {
  href: string;
  label: string;
  icon: IconName;
  roles: Role[];
  match?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const ALL: Role[] = ['STUDENT', 'LEADER', 'ADMIN', 'DEVELOPER'];
const STAFF: Role[] = ['LEADER', 'ADMIN', 'DEVELOPER'];
const ADMINS: Role[] = ['ADMIN', 'DEVELOPER'];

const GROUPS: NavGroup[] = [
  {
    title: 'Formación',
    items: [
      { href: '/dashboard', label: 'Inicio', icon: 'home', roles: ALL },
      { href: '/cursos', label: 'Cursos', icon: 'book', roles: ALL },
      { href: '/devocionales', label: 'Devocionales', icon: 'sun', roles: ALL },
      { href: '/mis-trabajos', label: 'Mis trabajos', icon: 'clipboard', roles: ['STUDENT'] },
      { href: '/mi-historial', label: 'Historial', icon: 'clock', roles: ['STUDENT'] },
    ],
  },
  {
    title: 'Pastoreo',
    items: [
      { href: '/admin/dashboard', label: 'Panel', icon: 'grid', roles: STAFF },
      { href: '/admin/grupos', label: 'Grupos', icon: 'users', roles: STAFF },
      { href: '/admin/contenido', label: 'Contenido', icon: 'file', roles: STAFF },
      { href: '/admin/devocional/nuevo', label: 'Nuevo devocional', icon: 'plus', roles: STAFF },
      { href: '/admin/calificaciones', label: 'Calificaciones', icon: 'check', roles: STAFF },
      { href: '/admin/seguimiento', label: 'Seguimiento', icon: 'heart', roles: STAFF },
      { href: '/admin/usuarios', label: 'Usuarios', icon: 'users', roles: ADMINS },
      { href: '/admin/configuracion', label: 'Iglesia', icon: 'settings', roles: ADMINS },
    ],
  },
  {
    title: 'Ministerio',
    items: [
      { href: '/worship/dashboard', label: 'Alabanza', icon: 'music', roles: STAFF, match: '/worship' },
      { href: '/developer/sistema', label: 'Sistema', icon: 'code', roles: ['DEVELOPER'], match: '/developer' },
    ],
  },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const open = useUiStore((state) => state.sidebarOpen);
  const close = useUiStore((state) => state.closeSidebar);
  const groups = GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => user && item.roles.includes(user.role)),
  })).filter((group) => group.items.length > 0);

  const isActive = (item: NavItem): boolean => {
    const prefix = item.match ?? item.href;
    return pathname === item.href || pathname.startsWith(`${prefix}/`) || pathname === prefix;
  };

  return (
    <>
      {open ? (
        <button className="fixed inset-0 z-30 bg-ink/40 lg:hidden" onClick={close} aria-label="Cerrar menú" />
      ) : null}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-teal-dark p-5 text-cream transition-transform lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Logo inverted />
        <nav className="mt-8 flex-1 space-y-6 overflow-y-auto">
          {groups.map((group) => (
            <div key={group.title}>
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-light/80">
                {group.title}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = isActive(item);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={close}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                        active ? 'bg-white/10 text-white' : 'text-cream/70 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon name={item.icon} className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <Link
          href="/perfil"
          onClick={close}
          className="mt-4 flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-cream/70 hover:bg-white/5 hover:text-white"
        >
          <Icon name="user" className="h-4 w-4" />
          Perfil
        </Link>
      </aside>
    </>
  );
};
