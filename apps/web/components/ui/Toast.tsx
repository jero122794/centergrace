// apps/web/components/ui/Toast.tsx
'use client';

import { useEffect } from 'react';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useToastStore, type ToastTone } from '@/store/toast.store';
import { cn } from '@/lib/cn';

const ICONS: Record<ToastTone, typeof Info> = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const BORDERS: Record<ToastTone, string> = {
  success: 'border-l-success-d',
  error: 'border-l-danger-d',
  info: 'border-l-accent',
};

/**
 * Global toast viewport. Mount once in Providers.
 */
export const ToastViewport = () => {
  const toasts = useToastStore((state) => state.toasts);
  const dismiss = useToastStore((state) => state.dismiss);

  return (
    <div className="pointer-events-none fixed inset-x-4 top-4 z-50 mx-auto flex max-w-md flex-col gap-2 md:inset-x-auto md:right-4 md:mx-0">
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
  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(id), 4000);
    return () => window.clearTimeout(timer);
  }, [id, onDismiss]);

  return (
    <div
      role="status"
      className={cn(
        'pointer-events-auto flex animate-slidedown items-start gap-3 rounded-xl border-l-4 bg-paper px-[18px] py-3.5 shadow-toast',
        BORDERS[tone],
      )}
    >
      <Icon className="mt-0.5 h-[18px] w-[18px] text-dark" aria-hidden />
      <p className="flex-1 text-[13px] text-dark">{message}</p>
      <button type="button" className="text-muted hover:text-dark" onClick={() => onDismiss(id)} aria-label="Cerrar aviso">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
