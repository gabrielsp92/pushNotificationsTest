console.log('Service Worker Loaded')

self.addEventListener('push', e => {
  const data = e.data.json()
  console.log('Push received...')
  self.registration.showNotification(data.title, {
    body: 'Notified By Gabriel Soares',
  })
  console.log('Notification shown')
})