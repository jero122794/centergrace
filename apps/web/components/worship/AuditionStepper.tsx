// apps/web/components/worship/AuditionStepper.tsx
import { cn } from '@/lib/cn';

export const AUDITION_STEPS = ['SCHOOL', 'ELIGIBLE', 'SCHEDULED', 'APPROVED'] as const;

export type AuditionStep = (typeof AUDITION_STEPS)[number];

interface Props {
  current: AuditionStep;
}

const LABELS: Record<AuditionStep, string> = {
  SCHOOL: 'Escuela',
  ELIGIBLE: 'Elegible',
  SCHEDULED: 'Audición',
  APPROVED: 'Equipo',
};

/**
 * Four-stage worship onboarding path.
 *
 * @example
 * <AuditionStepper current="SCHOOL" />
 */
export const AuditionStepper = ({ current }: Props) => {
  const currentIndex = AUDITION_STEPS.indexOf(current);
  return (
    <ol className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {AUDITION_STEPS.map((step, index) => {
        const active = index === currentIndex;
        const done = index < currentIndex;
        return (
          <li
            key={step}
            className={cn(
              'rounded-xl border px-4 py-3 text-center',
              active ? 'border-worship bg-worship-l' : 'border-border bg-paper',
              done && 'border-success-d/30 bg-success',
            )}
          >
            <p className="text-[11px] font-bold uppercase tracking-wide text-worship">
              {index + 1}. {LABELS[step]}
            </p>
            {active ? <p className="mt-1 text-xs text-muted">Etapa actual</p> : null}
          </li>
        );
      })}
    </ol>
  );
};
