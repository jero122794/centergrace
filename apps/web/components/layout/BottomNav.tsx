// apps/web/components/layout/BottomNav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon, type IconName } from '@/components/ui/Icon';

const ITEMS: Array<{ href: string; label: string; icon: IconName }> = [
  { href: '/dashboard', label: 'Inicio', icon: 'home' },
  { href: '/cursos', label: 'Cursos', icon: 'book' },
  { href: '/devocionales', label: 'Devocional', icon: 'sun' },
  { href: '/perfil', label: 'Perfil', icon: 'user' },
];

export const BottomNav = () => {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-teal/10 bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      {ITEMS.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 py-3 text-[11px] ${
              active ? 'font-semibold text-teal' : 'text-ink/45'
            }`}
          >
            <Icon name={item.icon} className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};
