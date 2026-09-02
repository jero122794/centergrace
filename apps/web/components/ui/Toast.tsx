// apps/web/components/ui/Toast.tsx
'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useToastStore, type ToastTone } from '@/store/toast.store';
import { cx } from '@/lib/cn';
import styles from './Toast.module.css';

const ICONS: Record<ToastTone, typeof Info> = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const TONES: Record<ToastTone, string> = {
  success: styles.success,
  error: styles.error,
  info: styles.info,
};

/**
 * Global toast viewport. Mount once in Providers.
 * Toasts drop from above with a spring; dismiss slides them out to the right.
 */
export const ToastViewport = () => {
  const toasts = useToastStore((state) => state.toasts);
  const dismiss = useToastStore((state) => state.dismiss);

  return (
    <div className={styles.viewport}>
      {toasts.map((toast) => {
        const Icon = ICONS[toast.tone];
        return (
          <ToastItemView
            key={toast.id}
            id={toast.id}
            message={toast.message}
            tone={toast.tone}
            Icon={Icon}
            onDismiss={dismiss}
          />
        );
      })}
    </div>
  );
};

interface ItemProps {
  id: string;
  message: string;
  tone: ToastTone;
  Icon: typeof Info;
  onDismiss: (id: string) => void;
}

const ToastItemView = ({ id, message, tone, Icon, onDismiss }: ItemProps) => {
  const [leaving, setLeaving] = useState(false);

  const close = (): void => {
    setLeaving(true);
    window.setTimeout(() => onDismiss(id), 280);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLeaving(true);
      window.setTimeout(() => onDismiss(id), 280);
    }, 4000);
    return () => window.clearTimeout(timer);
  }, [id, onDismiss]);

  return (
    <div role="status" className={cx(styles.item, TONES[tone], leaving && styles.leaving)}>
      <Icon className={styles.icon} aria-hidden />
      <p className={styles.message}>{message}</p>
      <button type="button" className={styles.close} onClick={close} aria-label="Cerrar aviso">
        <X className={styles.closeIcon} />
      </button>
    </div>
  );
};
