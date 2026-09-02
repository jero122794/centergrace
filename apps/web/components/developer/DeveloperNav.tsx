// apps/web/components/developer/DeveloperNav.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cx } from '@/lib/cn';
import styles from './DeveloperNav.module.css';

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
    <nav className={styles.nav}>
      <label className={styles.mobile}>
        <span className={styles.sr}>Sección del panel</span>
        <select
          className={styles.select}
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
      <div className={styles.tabs}>
        {ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cx(styles.tab, pathname === item.href && styles.current)}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};
