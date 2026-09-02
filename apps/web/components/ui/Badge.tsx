// apps/web/components/ui/Badge.tsx
interface Props {
  children: string;
  tone?: 'teal' | 'gold' | 'danger' | 'neutral';
}

const tones: Record<NonNullable<Props['tone']>, string> = {
  teal: 'bg-teal/10 text-teal-dark',
  gold: 'bg-gold/20 text-ink',
  danger: 'bg-red-100 text-red-700',
  neutral: 'bg-slate-100 text-slate-700',
};

export const Badge = ({ children, tone = 'teal' }: Props) => (
  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]}`}>
    {children}
  </span>
);
