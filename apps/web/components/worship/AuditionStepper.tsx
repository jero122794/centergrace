// apps/web/components/worship/AuditionStepper.tsx
import { cx } from '@/lib/cn';
import styles from './AuditionStepper.module.css';

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
    <ol className={styles.list}>
      {AUDITION_STEPS.map((step, index) => {
        const active = index === currentIndex;
        const done = index < currentIndex;
        return (
          <li key={step} className={cx(styles.step, active && styles.active, done && styles.done)}>
            <p className={styles.label}>
              {index + 1}. {LABELS[step]}
            </p>
            {active ? <p className={styles.now}>Etapa actual</p> : null}
          </li>
        );
      })}
    </ol>
  );
};
