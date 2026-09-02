// apps/web/components/courses/ProgressBar.tsx
interface Props {
  percent: number;
}

export const ProgressBar = ({ percent }: Props) => {
  const value = Math.min(100, Math.max(0, percent));
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-ink/55">
        <span>Progreso</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-teal-mist">
        <div className="h-full rounded-full bg-teal transition-all" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
};
