import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F3EBE1',
        ink: '#1C2A24',
        teal: {
          DEFAULT: '#2F5D50',
          dark: '#1E3A32',
          light: '#4A7C6F',
          mist: '#E4EDE8',
        },
        gold: {
          DEFAULT: '#C4A265',
          dark: '#A6844A',
          light: '#E8D7B0',
        },
        surface: '#FFFCF7',
      },
      fontFamily: {
        sans: ['var(--font-source-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-libre-baskerville)', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 10px 30px -18px rgba(28, 42, 36, 0.35)',
        lift: '0 18px 40px -24px rgba(47, 93, 80, 0.45)',
      },
      backgroundImage: {
        linen:
          'radial-gradient(1200px 520px at 8% -10%, rgba(47, 93, 80, 0.14), transparent 55%), radial-gradient(900px 420px at 100% 0%, rgba(196, 162, 101, 0.18), transparent 50%)',
      },
    },
  },
  plugins: [],
};

export default config;
