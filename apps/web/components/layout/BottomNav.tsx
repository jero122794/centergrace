// apps/web/components/layout/BottomNav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, CheckCircle2, Grid3x3, Home, Sun, User, Users, type LucideIcon } from 'lucide-react';
import { cx } from '@/lib/cn';
import { useAuthStore, type Role } from '@/store/auth.store';
import styles from './BottomNav.module.css';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const ITEMS: Record<Role, NavItem[]> = {
  STUDENT: [
    { href: '/dashboard', label: 'Inicio', icon: Home },
    { href: '/cursos', label: 'Cursos', icon: BookOpen },
    { href: '/devocionales', label: 'Hoy', icon: Sun },
    { href: '/perfil', label: 'Tú', icon: User },
  ],
  LEADER: [
    { href: '/admin/dashboard', label: 'Panel', icon: Grid3x3 },
    { href: '/admin/grupos', label: 'Grupos', icon: Users },
    { href: '/admin/calificaciones', label: 'Notas', icon: CheckCircle2 },
    { href: '/perfil', label: 'Tú', icon: User },
  ],
  ADMIN: [
    { href: '/admin/dashboard', label: 'Panel', icon: Grid3x3 },
    { href: '/admin/grupos', label: 'Grupos', icon: Users },
    { href: '/cursos', label: 'Cursos', icon: BookOpen },
    { href: '/perfil', label: 'Tú', icon: User },
  ],
  DEVELOPER: [
    { href: '/developer/sistema', label: 'Sistema', icon: Grid3x3 },
    { href: '/cursos', label: 'Cursos', icon: BookOpen },
    { href: '/devocionales', label: 'Hoy', icon: Sun },
    { href: '/perfil', label: 'Tú', icon: User },
  ],
};

/**
 * Four-item mobile dock. Active item shows a warm dot.
 */
export const BottomNav = () => {
  const pathname = usePathname();
  const role = useAuthStore((state) => state.user?.role) ?? 'STUDENT';
  return (
    <nav className={styles.nav} aria-label="Móvil">
      {ITEMS[role].map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        return (
          <Link key={item.href} href={item.href} className={cx(styles.item, active && styles.active)}>
            <Icon width={22} height={22} aria-hidden />
            {item.label}
            {active ? <span className={styles.dot} /> : null}
          </Link>
        );
      })}
    </nav>
  );
};
