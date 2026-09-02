// apps/web/components/developer/DeveloperNav.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/cn';

const ITEMS = [
  { href: '/developer/sistema', label: 'Sistema' },
  { href: '/developer/servicios', label: 'Servicios' },
  { href: '/developer/logs', label: 'Logs' },
  { href: '/developer/jobs', label: 'Jobs' },
  { href: '/developer/entorno', label: 'Entorno' },
];

/**
 * Horizontal developer tabs on desktop; native select on mobile.
 */
export const DeveloperNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <nav className="mb-6">
      <label className="block md:hidden">
        <span className="sr-only">Sección del panel</span>
        <select
          className="w-full rounded-[10px] border-[1.5px] border-dev/40 bg-paper px-3 py-2.5 font-mono text-sm text-dark"
          value={ITEMS.find((item) => pathname.startsWith(item.href))?.href ?? ITEMS[0].href}
          onChange={(event) => {
            router.push(event.target.value);
          }}
        >
          {ITEMS.map((item) => (
            <option key={item.href} value={item.href}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <div className="hidden gap-2 md:flex">
        {ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'rounded-full px-4 py-1.5 font-mono text-xs uppercase tracking-wide transition duration-150',
              pathname === item.href ? 'bg-dev text-white' : 'border border-dev/30 bg-dev-l text-dev',
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};
