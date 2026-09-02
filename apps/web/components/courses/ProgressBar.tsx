// apps/web/components/courses/ProgressBar.tsx
interface Props {
  percent: number;
}

export const ProgressBar = ({ percent }: Props) => (
  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
    <div className="h-full rounded-full bg-teal" style={{ width: `${Math.min(100, Math.max(0, percent))}%` }} />
  </div>
);
