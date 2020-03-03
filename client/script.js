
function subscribe() {
  if ('serviceWorker' in navigator) {
    send().catch(err => console.error(err))
  }
}

function sendMessage() {
  if ('serviceWorker' in navigator) {
    sendMessage().catch(err => console.error(err))
  }
}

async function send() {
  try {
    // register SW
    let register = await navigator.serviceWorker.getRegistration('/serviceWorker.js')
    if (!register) {
      register = await navigator.serviceWorker.register('/serviceworker.js', {
        scope: '/'
      })
    }
    // register subscription
    let subscription = await register.pushManager.getSubscription()
    if (!subscription) {
      //  Get Public Key
      const response = await fetch('/public-key', {
        method: 'GET',
        headers: {
          'content-type': 'application/json'
        }
      })
      const { publicVapidKey } = await response.json()
      subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
      })
    }
    // send Subscribe Request to API
    await fetch('/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: {
        'content-type': 'application/json'
      },
    })
  } catch (err) {
    console.log({err})
  }
}

async function sendMessage() {
  const text = document.getElementById('messageText').value;
  const title = document.getElementById('titleText').value;
  const icon = document.getElementById('iconUrl').value;
  const url = document.getElementById('actionUrl').value;
  await fetch('/send-notification', {
    method: 'POST',
    body: JSON.stringify({ text, title, icon, url }),
    headers: {
      'content-type': 'application/json'
    }
  });
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