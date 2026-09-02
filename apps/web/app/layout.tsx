// apps/web/app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Fraunces, IBM_Plex_Mono, Outfit } from 'next/font/google';
import { Providers } from '@/components/layout/Providers';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
});

const ibmPlex = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-ibm-plex',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Centro de Gracia',
  description: 'Estudios, comunidad y alabanza — Centro Misionero Shalom',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Centro de Gracia',
  },
  icons: {
    apple: '/icons/icon-192.png',
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: '#14211d',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="es">
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </head>
    <body className={`${outfit.variable} ${fraunces.variable} ${ibmPlex.variable}`}>
      <Providers>{children}</Providers>
    </body>
  </html>
);

export default RootLayout;
