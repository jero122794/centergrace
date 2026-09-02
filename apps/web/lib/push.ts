import { api } from './api';

const vapidKey = process.env.NEXT_PUBLIC_VAPID_KEY ?? '';

const urlBase64ToUint8Array = (base64: string): Uint8Array => {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from([...raw].map((char) => char.charCodeAt(0)));
};

export const isPushSupported = (): boolean =>
  typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window && vapidKey.length > 0;

export const subscribeToPush = async (): Promise<boolean> => {
  if (!isPushSupported()) {
    throw new Error('Las notificaciones push requieren HTTPS y una clave VAPID configurada.');
  }
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error('Permiso de notificaciones denegado.');
  }
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidKey) as BufferSource,
  });
  await api.post('/api/notifications/subscribe', subscription.toJSON());
  return true;
};

export const unsubscribeFromPush = async (): Promise<void> => {
  if (!('serviceWorker' in navigator)) {
    return;
  }
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    return;
  }
  await api.delete('/api/notifications/subscribe', { data: { endpoint: subscription.endpoint } });
  await subscription.unsubscribe();
};
