// apps/web/components/developer/DeveloperNav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ITEMS = [
  { href: '/developer/sistema', label: 'Sistema' },
  { href: '/developer/servicios', label: 'Servicios' },
  { href: '/developer/logs', label: 'Logs' },
  { href: '/developer/jobs', label: 'Jobs' },
  { href: '/developer/entorno', label: 'Entorno' },
];

export const DeveloperNav = () => {
  const pathname = usePathname();
  return (
    <nav className="mb-6 flex flex-wrap gap-2">
      {ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`rounded-full px-3 py-1 text-sm ${
            pathname === item.href ? 'bg-teal text-white' : 'bg-white text-teal border border-teal/20'
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};
