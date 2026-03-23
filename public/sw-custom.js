/* ── Push Notification Handler ────────────────────── */

self.addEventListener('push', (event) => {
  const fallback = { title: 'Capivarex', body: 'You have a new notification.' };
  let data = fallback;

  try {
    data = event.data ? event.data.json() : fallback;
  } catch {
    data = { ...fallback, body: event.data?.text() ?? fallback.body };
  }

  const options = {
    body: data.body || '',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-96.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
    },
    actions: data.actions || [],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Capivarex', options),
  );
});

/* ── Notification Click Handler ──────────────────── */

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        /* Focus existing window if possible */
        for (const client of windowClients) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.navigate(targetUrl);
            return client.focus();
          }
        }
        /* Otherwise open new window */
        return clients.openWindow(targetUrl);
      }),
  );
});
