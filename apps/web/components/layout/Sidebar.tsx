// apps/web/components/layout/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  CheckCircle2,
  Clock3,
  Code2,
  FileText,
  Grid3x3,
  Heart,
  Home,
  Music,
  Plus,
  Settings,
  Sun,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { Badge, roleTone } from '@/components/ui/Badge';
import { useAuthStore, type Role } from '@/store/auth.store';
import { useUiStore } from '@/store/ui.store';
import { cn } from '@/lib/cn';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
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
      { href: '/dashboard', label: 'Inicio', icon: Home, roles: ALL },
      { href: '/cursos', label: 'Cursos', icon: BookOpen, roles: ALL },
      { href: '/devocionales', label: 'Devocionales', icon: Sun, roles: ALL },
      { href: '/mis-trabajos', label: 'Mis trabajos', icon: FileText, roles: ['STUDENT'] },
      { href: '/mi-historial', label: 'Historial', icon: Clock3, roles: ['STUDENT'] },
    ],
  },
  {
    title: 'Pastoreo',
    items: [
      { href: '/admin/dashboard', label: 'Panel', icon: Grid3x3, roles: STAFF },
      { href: '/admin/grupos', label: 'Grupos', icon: Users, roles: STAFF },
      { href: '/admin/contenido', label: 'Contenido', icon: FileText, roles: STAFF },
      { href: '/admin/devocional/nuevo', label: 'Nuevo devocional', icon: Plus, roles: STAFF },
      { href: '/admin/calificaciones', label: 'Calificaciones', icon: CheckCircle2, roles: STAFF },
      { href: '/admin/seguimiento', label: 'Seguimiento', icon: Heart, roles: STAFF },
      { href: '/admin/usuarios', label: 'Usuarios', icon: Users, roles: ADMINS },
      { href: '/admin/configuracion', label: 'Iglesia', icon: Settings, roles: ADMINS },
    ],
  },
  {
    title: 'Ministerio',
    items: [
      { href: '/worship/dashboard', label: 'Alabanza', icon: Music, roles: STAFF, match: '/worship' },
      { href: '/developer/sistema', label: 'Sistema', icon: Code2, roles: ['DEVELOPER'], match: '/developer' },
    ],
  },
];

/**
 * Persistent light sidebar with role-filtered navigation.
 */
export const Sidebar = () => {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const open = useUiStore((state) => state.sidebarOpen);
  const close = useUiStore((state) => state.closeSidebar);
  const worship = pathname.startsWith('/worship');
  const developer = pathname.startsWith('/developer');
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
        <button className="fixed inset-0 z-30 bg-dark/25 lg:hidden" onClick={close} aria-label="Cerrar menú" />
      ) : null}
      <aside
        className={cn(
          'group/sidebar fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r bg-surface transition-[width,transform] duration-[250ms] ease-in-out lg:static lg:translate-x-0',
          worship ? 'border-worship/30' : developer ? 'border-dev/30' : 'border-border',
          'md:w-16 md:hover:w-[220px] md:overflow-hidden lg:w-[260px] lg:hover:w-[260px]',
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        )}
      >
        <div className="flex h-16 items-center border-b border-border px-5">
          <Logo compact={false} />
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          {groups.map((group) => (
            <div key={group.title}>
              <p className="hidden px-6 pb-2 pt-4 text-[10px] font-semibold uppercase tracking-[0.08em] text-hint md:group-hover/sidebar:block lg:block">
                {group.title}
              </p>
              <div>
                {group.items.map((item) => {
                  const active = isActive(item);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={close}
                      title={item.label}
                      className={cn(
                        'mx-2 my-0.5 flex items-center gap-3 rounded-[10px] px-4 py-2.5 text-sm text-muted transition',
                        'hover:bg-paper hover:text-accent',
                        active && 'border-l-[3px] border-accent bg-primary/20 font-semibold text-accent',
                        worship && item.match === '/worship' && 'border-worship text-worship',
                        developer && item.match === '/developer' && 'border-dev text-dev',
                      )}
                    >
                      <Icon className="h-5 w-5 shrink-0" aria-hidden />
                      <span className="truncate md:hidden md:group-hover/sidebar:inline lg:inline">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        {user ? (
          <Link href="/perfil" onClick={close} className="m-2 rounded-xl border border-border bg-paper p-3">
            <p className="truncate text-[13px] font-semibold text-dark">{user.name}</p>
            <Badge tone={roleTone(user.role)} className="mt-1">
              {user.role}
            </Badge>
          </Link>
        ) : null}
      </aside>
    </>
  );
};
