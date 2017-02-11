const express = require('express')
const router = express.Router()
const ms = require('ms')
const apn = require('apn')
const joi = require('joi')
const { validate } = require('../helpers')
const Wc = require('../schemas/wc')

router.get('/', (req, res) => {
  const params = req.query
  if('category' in params) {
    Wc.find({ categoryIda: params.category }, (err, item) => {
      if(err) {
        console.error(err);
      }
      res.json({
        status: 'success',
        data: item
      })
    })
  } else {
    Wc.find((err, items) => {
      if(err) {
        console.error(err);
      }
      res.json({
        status: 'success',
        data: items
      })
    })
  }
})

const apnProvider = new apn.Provider({
  token: {
    key: process.env.IOS_PATH_TO_P8_FILE,
    keyId: process.env.IOS_KEY_ID,
    teamId: process.env.IOS_TEAM_ID
  },
  production: false
})

const sendNotification = deviceToken => {
  const notification = new apn.Notification()
  notification.topic = process.env.IOS_BUNDLE_ID
  notification.expiry = ms('1h')
  notification.badge = 1
  notification.sound = 'ping.aiff'
  notification.alert = 'Hello World \u270C'
  notification.payload = { id: 123 }
  return apnProvider.send(notification, deviceToken)
}

router.get('/:wcId/notify', async (req, res) => {
  const { wcId } = res.params
  const wc = Wc.findById(wcId)
  Promise.all(wc.deviceTokens.map(sendNotification))
  .then((results) => {
    console.log(results)
    res.sendStatus(204)
  })
  .catch(err => console.log(err))
})

const expSchema = joi.object({
  deviceToken: joi.string().required()
}).required()

router.post('/:wcId/subscribe', validate('body', expSchema), async (req, res) => {
  const { deviceToken } = req.body
  const wc = Wc.findById(wcId)
  wc.deviceTokens.push(deviceToken)
  wc.save(() => res.status(201).json())
  .catch(err => console.log(err))
})

router.post('/:wcId/unsubscribe', validate('body', expSchema), async (req, res) => {
  const { deviceToken } = req.body
  const wc = Wc.findById(wcId)
  const deviceTokenIndex = wc.deviceTokens.findIndex()
  wc.deviceTokens = [
    ...deviceToken.slice(0, deviceTokenIndex),
    ...deviceToken.slice(deviceTokenIndex + 1)
  ]
  wc.save(() => res.status(201).json())
  .catch(err => console.log(err))
})

module.exports = router
