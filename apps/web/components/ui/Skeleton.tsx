// apps/web/components/ui/Skeleton.tsx
interface Props {
  className?: string;
  lines?: number;
}

export const Skeleton = ({ className = 'h-24', lines }: Props) => {
  if (lines) {
    return (
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <div key={index} className="h-20 animate-pulse rounded-2xl bg-teal/10" />
        ))}
      </div>
    );
  }
  return <div className={`animate-pulse rounded-2xl bg-teal/10 ${className}`} />;
};
