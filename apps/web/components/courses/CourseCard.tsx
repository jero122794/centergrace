// apps/web/components/courses/CourseCard.tsx
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/courses/ProgressBar';
import styles from './CourseCard.module.css';

interface Props {
  id: string;
  title: string;
  description: string;
  scope: string;
  percent?: number;
  enterDelay?: number;
}

/**
 * Course entry as a slightly tilted paper sheet. Title is the king; action is a gold underline.
 */
export const CourseCard = ({ id, title, description, scope, percent, enterDelay = 0 }: Props) => (
  <Link href={`/cursos/${id}`} className={styles.link}>
    <Card hover enterDelay={enterDelay} className={styles.article}>
      <Badge tone="warm">{scope}</Badge>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.body}>{description}</p>
      {typeof percent === 'number' ? <ProgressBar className={styles.progress} percent={percent} /> : null}
      <p className={styles.action}>Abrir lección</p>
    </Card>
  </Link>
);
