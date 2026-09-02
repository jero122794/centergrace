import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F7F3EF',
        ink: '#1F2933',
        teal: {
          DEFAULT: '#4A7C7F',
          dark: '#3A6366',
          light: '#6A9B9E',
        },
        gold: '#C4A574',
        surface: '#FFFFFF',
      },
      fontFamily: {
        sans: ['var(--font-source-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-libre-baskerville)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
