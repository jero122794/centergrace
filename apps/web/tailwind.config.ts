import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        paper: 'var(--color-white)',
        primary: {
          DEFAULT: 'var(--color-primary)',
          d: 'var(--color-primary-d)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
          active: 'var(--color-accent-active)',
        },
        dark: 'var(--color-dark)',
        warm: 'var(--color-warm)',
        gold: {
          DEFAULT: 'var(--color-gold)',
          d: 'var(--color-gold-d)',
        },
        success: {
          DEFAULT: 'var(--color-success)',
          d: 'var(--color-success-d)',
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
          d: 'var(--color-warning-d)',
        },
        danger: {
          DEFAULT: 'var(--color-danger)',
          d: 'var(--color-danger-d)',
        },
        info: {
          DEFAULT: 'var(--color-info)',
          d: 'var(--color-info-d)',
        },
        muted: 'var(--color-muted)',
        hint: 'var(--color-hint)',
        border: {
          DEFAULT: 'var(--color-border)',
          f: 'var(--color-border-f)',
        },
        worship: {
          DEFAULT: 'var(--color-worship)',
          l: 'var(--color-worship-l)',
        },
        dev: {
          DEFAULT: 'var(--color-dev)',
          l: 'var(--color-dev-l)',
        },
        cream: 'var(--color-bg)',
        ink: 'var(--color-dark)',
        teal: {
          DEFAULT: 'var(--color-accent)',
          dark: 'var(--color-dark)',
          light: 'var(--color-primary-d)',
          mist: 'var(--color-surface)',
        },
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        mono: ['var(--font-jetbrains)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        display: ['40px', { lineHeight: '1.15', fontWeight: '700' }],
        h1: ['32px', { lineHeight: '1.2', fontWeight: '700' }],
        h2: ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '1.7', fontWeight: '400' }],
        body: ['15px', { lineHeight: '1.6', fontWeight: '400' }],
        verse: ['18px', { lineHeight: '1.5', fontWeight: '400' }],
      },
      maxWidth: {
        content: '1280px',
      },
      boxShadow: {
        card: '0 2px 12px rgba(30, 58, 60, 0.06)',
        lift: '0 4px 20px rgba(30, 58, 60, 0.10)',
        toast: '0 8px 24px rgba(0, 0, 0, 0.10)',
        auth: '0 8px 40px rgba(30, 58, 60, 0.10)',
        nav: '0 -2px 12px rgba(30, 58, 60, 0.08)',
      },
      borderRadius: {
        pill: '24px',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadein: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slidedown: {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s ease-in-out infinite',
        fadein: 'fadein 200ms ease',
        slidedown: 'slidedown 250ms ease',
      },
    },
  },
  plugins: [],
};

export default config;
