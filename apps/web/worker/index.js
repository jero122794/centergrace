'use strict';

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Centro Misionero Shalom';
  const options = {
    body: data.body || '',
    data: { url: data.url || '/dashboard' },
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/dashboard';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((client) => client.url.includes(url) && 'focus' in client);
      if (existing) {
        return existing.focus();
      }
      return self.clients.openWindow(url);
    }),
  );
});
