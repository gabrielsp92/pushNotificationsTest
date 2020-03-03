self.addEventListener('push', e => {
  const data = e.data.json()
  self.registration.showNotification(data.title, {
    body: data.text || 'Nova Notificação disponível',
    icon: data.icon || '',
    data: {
      url: data.url,
    }
  })
})

self.addEventListener('notificationclick', async function(e) {
  e.notification.close();
  await clients.openWindow(e.notification.data.url)
})