// apps/web/components/layout/BottomNav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ITEMS = [
  { href: '/dashboard', label: 'Inicio' },
  { href: '/cursos', label: 'Cursos' },
  { href: '/devocionales', label: 'Devocional' },
  { href: '/perfil', label: 'Perfil' },
];

export const BottomNav = () => {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-teal/10 bg-white md:hidden">
      {ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`py-3 text-center text-xs ${pathname.startsWith(item.href) ? 'text-teal font-semibold' : 'text-slate-500'}`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};
