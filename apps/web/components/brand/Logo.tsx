// apps/web/components/brand/Logo.tsx
interface Props {
  variant?: 'mark' | 'full';
  inverted?: boolean;
  className?: string;
}

export const Logo = ({ variant = 'full', inverted = false, className = '' }: Props) => {
  const ink = inverted ? 'text-cream' : 'text-teal';
  const muted = inverted ? 'text-gold-light' : 'text-teal-light';
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className={`relative inline-flex h-10 w-10 items-center justify-center rounded-2xl ${inverted ? 'bg-white/10' : 'bg-teal'} text-gold-light`}>
        <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" aria-hidden>
          <path
            d="M16 6c2.8 3.2 4.2 6.4 4.2 9.2 0 3.4-1.8 6.2-4.2 8-2.4-1.8-4.2-4.6-4.2-8C11.8 12.4 13.2 9.2 16 6Z"
            fill="currentColor"
            opacity="0.95"
          />
          <path d="M8 18.5c3.4.2 6 1.8 8 4.5 2-2.7 4.6-4.3 8-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </span>
      {variant === 'full' ? (
        <span className="leading-tight">
          <span className={`block font-display text-lg ${ink}`}>Shalom</span>
          <span className={`block text-[11px] uppercase tracking-[0.18em] ${muted}`}>Centro Misionero</span>
        </span>
      ) : null}
    </div>
  );
};
