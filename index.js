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


webPush.setVapidDetails('mailto:test@test.com', publicVapidKey, privateVapidKey)

app.get('/public-key', async function (req, res) {
  res.status(200).send({ publicVapidKey })
})

// subscribe route
app.post('/subscribe', async function (req, res) {
  // get subscription object
  const subscription = req.body
  
  // Send notification
  // create payload
  const payload = JSON.stringify({
    title: 'Push test'
  })
  
  webPush.sendNotification(subscription, payload).catch(err => console.err(err))

  // send response status
  return res.send(201).json({})
})

const port = 5000

app.listen(port, () => console.log(`Server started at port ${port}`))