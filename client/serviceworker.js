console.log('Service Worker Loaded')

self.addEventListener('push', e => {
  const data = e.data.json()
  self.registration.showNotification(data.title, {
    body: data.text || 'Nova Notificação disponível',
    icon: data.icon || '',
    data: {
      url: 'http://www.google.com.br',
    }
  })
})

self.addEventListener('notificationclick', async function(e) {
  console.log(e.notification.data.url)
  await clients.openWindow(e.notification.data.url)
})