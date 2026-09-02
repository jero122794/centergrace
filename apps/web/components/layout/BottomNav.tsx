// apps/web/components/layout/BottomNav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, CheckCircle2, Grid3x3, Home, Sun, User, Users, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useAuthStore, type Role } from '@/store/auth.store';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const ITEMS: Record<Role, NavItem[]> = {
  STUDENT: [
    { href: '/dashboard', label: 'Inicio', icon: Home },
    { href: '/cursos', label: 'Cursos', icon: BookOpen },
    { href: '/devocionales', label: 'Devocional', icon: Sun },
    { href: '/perfil', label: 'Perfil', icon: User },
  ],
  LEADER: [
    { href: '/admin/dashboard', label: 'Panel', icon: Grid3x3 },
    { href: '/admin/grupos', label: 'Grupos', icon: Users },
    { href: '/admin/calificaciones', label: 'Notas', icon: CheckCircle2 },
    { href: '/perfil', label: 'Perfil', icon: User },
  ],
  ADMIN: [
    { href: '/admin/dashboard', label: 'Panel', icon: Grid3x3 },
    { href: '/admin/grupos', label: 'Grupos', icon: Users },
    { href: '/cursos', label: 'Cursos', icon: BookOpen },
    { href: '/perfil', label: 'Perfil', icon: User },
  ],
  DEVELOPER: [
    { href: '/developer/sistema', label: 'Sistema', icon: Grid3x3 },
    { href: '/cursos', label: 'Cursos', icon: BookOpen },
    { href: '/devocionales', label: 'Devocional', icon: Sun },
    { href: '/perfil', label: 'Perfil', icon: User },
  ],
};

/**
 * Four-item mobile tab bar, filtered by role.
 */
export const BottomNav = () => {
  const pathname = usePathname();
  const role = useAuthStore((state) => state.user?.role) ?? 'STUDENT';
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 grid h-16 grid-cols-4 border-t border-border bg-paper shadow-nav md:hidden">
      {ITEMS[role].map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium',
              active ? 'text-accent' : 'text-hint',
            )}
          >
            <Icon className={cn('h-[22px] w-[22px] transition duration-200', active && 'scale-110')} />
            {item.label}
            {active ? <span className="h-1 w-1 rounded-full bg-accent" /> : <span className="h-1 w-1" />}
          </Link>
        );
      })}
    </nav>
  );
};
