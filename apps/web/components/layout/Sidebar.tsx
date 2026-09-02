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
import { useAuthStore, type Role } from '@/store/auth.store';
import { useUiStore } from '@/store/ui.store';
import { cx } from '@/lib/cn';
import styles from './Sidebar.module.css';

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
    title: 'Tu camino',
    items: [
      { href: '/dashboard', label: 'Inicio', icon: Home, roles: ALL },
      { href: '/cursos', label: 'Cursos', icon: BookOpen, roles: ALL },
      { href: '/devocionales', label: 'Devocional', icon: Sun, roles: ALL },
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

const initialsOf = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? 'C';
  const last = parts[1]?.[0] ?? '';
  return `${first}${last}`.toUpperCase();
};

/**
 * Dark identity rail. Active item settles with scale + gold tick.
 *
 * @param none Uses auth + ui stores.
 */
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
      {open ? <button className={styles.overlay} onClick={close} aria-label="Cerrar menú" type="button" /> : null}
      <aside className={cx(styles.rail, open && styles.open)}>
        <div className={styles.brand}>
          <Logo inverted />
        </div>
        {user ? (
          <Link href="/perfil" onClick={close} className={styles.profile}>
            <span className={styles.avatar} aria-hidden>
              {initialsOf(user.name)}
            </span>
            <span>
              <p className={styles.profileName}>{user.name}</p>
              <p className={styles.profileMeta}>{user.role.toLowerCase()}</p>
            </span>
          </Link>
        ) : null}
        <nav className={styles.nav} aria-label="Principal">
          {groups.map((group) => (
            <div key={group.title}>
              <p className={styles.groupTitle}>{group.title}</p>
              {group.items.map((item) => {
                const active = isActive(item);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={close}
                    title={item.label}
                    className={cx(styles.item, active && styles.itemActive)}
                    aria-current={active ? 'page' : undefined}
                  >
                    <Icon width={20} height={20} aria-hidden />
                    <span className={styles.label}>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <p className={styles.community}>
          <strong>Tu casa</strong>
          Centro Misionero Shalom
        </p>
      </aside>
    </>
  );
};
