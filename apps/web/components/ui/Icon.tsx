// apps/web/components/ui/Icon.tsx
import type { SVGProps } from 'react';
import styles from './Icon.module.css';

export type IconName =
  | 'home'
  | 'book'
  | 'sun'
  | 'bell'
  | 'user'
  | 'clipboard'
  | 'clock'
  | 'grid'
  | 'users'
  | 'file'
  | 'plus'
  | 'check'
  | 'heart'
  | 'music'
  | 'settings'
  | 'code'
  | 'menu'
  | 'logout'
  | 'spark'
  | 'arrow';

interface Props extends SVGProps<SVGSVGElement> {
  name: IconName;
}

const PATHS: Record<IconName, string> = {
  home: 'M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z',
  book: 'M5 5.5A2.5 2.5 0 0 1 7.5 3H20v16H7.5A2.5 2.5 0 0 0 5 21.5zM5 5.5v16',
  sun: 'M12 4v2m0 12v2m8-8h-2M6 12H4m12.95-4.95-1.4 1.4M8.45 15.55l-1.4 1.4m9.9 0-1.4-1.4M8.45 8.45 7.05 7.05M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z',
  bell: 'M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9zm4 11a2 2 0 0 0 4 0',
  user: 'M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm7 8a7 7 0 0 0-14 0',
  clipboard: 'M9 4h6a2 2 0 0 1 2 2v1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1V6a2 2 0 0 1 2-2zm0 0V3h6v1',
  clock: 'M12 7v5l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
  grid: 'M4 4h7v7H4zm9 0h7v7h-7zM4 13h7v7H4zm9 0h7v7h-7z',
  users: 'M16 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3zM8 12a3 3 0 1 0-3-3 3 3 0 0 0 3 3zm8 2c2.5 0 6 1.2 6 4v2H10v-2c0-2.8 3.5-4 6-4zM8 14c.4 0 .8 0 1.2.1A6.4 6.4 0 0 0 8 20H2v-2c0-2.8 3.5-4 6-4z',
  file: 'M7 3h7l5 5v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm7 0v5h5',
  plus: 'M12 5v14M5 12h14',
  check: 'M5 12.5 9.5 17 19 7.5',
  heart: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.6-7 10-7 10z',
  music: 'M9 18V6l10-2v12M9 18a3 3 0 1 1-3-3 3 3 0 0 1 3 3zm10-2a3 3 0 1 1-3-3 3 3 0 0 1 3 3z',
  settings:
    'M12 8.5A3.5 3.5 0 1 1 8.5 12 3.5 3.5 0 0 1 12 8.5zM4.5 12l1.2-2.1-1-2.2 2.2-1L8 5.5 10.1 4.3 12 5.5l2.1-1.2 2.2 1-.2 2.2L18 9.9 19.2 12 18 14.1l.2 2.2-2.2 1-1.1 1.2-2.1-1.2-2.1 1.2-1.1-1.2-2.2-1 .2-2.2L4.5 12z',
  code: 'M8 8 4 12l4 4m8-8 4 4-4 4M14 6l-4 12',
  menu: 'M5 7h14M5 12h14M5 17h14',
  logout: 'M10 6H6v12h4m4-9 4 3-4 3m4-3H10',
  spark: 'M12 3l1.2 6.3L19 12l-5.8 2.7L12 21l-1.2-6.3L5 12l5.8-2.7z',
  arrow: 'M5 12h14m-6-6 6 6-6 6',
};

/**
 * Stroke icon set used when Lucide is not imported.
 */
export const Icon = ({ name, className, ...props }: Props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className ?? styles.icon}
    aria-hidden
    {...props}
  >
    <path d={PATHS[name]} />
  </svg>
);
