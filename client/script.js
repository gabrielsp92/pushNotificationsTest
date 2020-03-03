// check for serviceWorker
if ('serviceWorker' in navigator) {
  send().catch(err => console.err(err))
}

// register SW, Register Push, Send Push
async function send() {
  // SW
  try {
    // get registering SW
    const register = await navigator.serviceWorker.register('/serviceworker.js', {
      scope: '/'
    })

    //  get vapidPublicKey
    console.log('Registering Push...')
    const response = await fetch('/public-key', {
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      }
    })

    const data = await response.json()

    const publicVapidKey = data.publicVapidKey

    const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    })
  
    // send Push Notification
    console.log('Sending Push...')
    await fetch('/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: {
        'content-type': 'application/json'
      },
    })
    console.log('Push Sent')
  } catch (err) {
    console.log({err})
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
 
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
 
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}