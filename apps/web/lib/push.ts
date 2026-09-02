// apps/web/lib/push.ts
import { api } from './api';

const vapidKey = process.env.NEXT_PUBLIC_VAPID_KEY ?? '';

const urlBase64ToUint8Array = (base64: string): Uint8Array => {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from([...raw].map((char) => char.charCodeAt(0)));
};

export const subscribeToPush = async (): Promise<void> => {
  if (!('serviceWorker' in navigator) || !vapidKey) {
    return;
  }
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidKey) as BufferSource,
  });
  await api.post('/api/notifications/subscribe', subscription.toJSON());
};
