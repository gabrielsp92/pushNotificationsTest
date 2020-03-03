// import express from 'express'
const express = require('express')
const bodyParser = require('body-parser')
const webPush = require('web-push')
const path = require('path')
require('dotenv').config()

const app = express();

// set static patch
app.use(express.static(path.join(__dirname, 'client')))

app.use(bodyParser.json())

// vapid credentials should be in env
const publicVapidKey = process.env.PUBLIC_VAPID_KEY
const privateVapidKey = process.env.PRIVATE_VAPID_KEY

let userSubscriptionState = null

webPush.setVapidDetails('mailto:test@test.com', publicVapidKey, privateVapidKey)

app.get('/public-key', async function (req, res) {
  res.status(200).send({ publicVapidKey })
})

// subscribe route
app.post('/subscribe', function (req, res) {
  // get subscription object  
  userSubscriptionState = req.body 
  // Send notification
  const payload = JSON.stringify({
    title: 'Subscription Complete',
    text: 'You will receive notifications from the server',
    icon: 'https://www.pinclipart.com/picdir/big/369-3699390_notification-png-notification-icon-png-free-clipart.png',
    url: 'http://www.google.com'
  })

  webPush.sendNotification(userSubscriptionState, payload).catch(err => console.log(err))
  // send response status
  return res.sendStatus(201)
})

app.post('/send-notification', (req, res) => {
  if (!userSubscriptionState) return res.status(400).send({ message: 'Subscription not found' })
  const { text, title, icon, url } = req.body
  const payload = JSON.stringify({
    title: title || 'New Notification',
    text: text || '',
    icon: icon || '',
    url: url || '',
  })
  webPush.sendNotification(userSubscriptionState, payload).catch(err => console.log(err))
  return res.sendStatus(200)
})

const port = 5000

app.listen(port, () => console.log(`Server started at port ${port}`))