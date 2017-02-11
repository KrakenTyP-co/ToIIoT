'use strict';

var express = require('express');
var ms = require('ms');
var apn = require('apn');
var router = express.Router();
var joi = require('joi');

var _require = require('../helpers'),
    validate = _require.validate;

// const apnProvider = new apn.Provider({
//    token: {
//     key: process.env.IOS_PATH_TO_P8_FILE,
//     keyId: process.env.IOS_KEY_ID,
//     teamId: process.env.IOS_TEAM_ID
//   },
//   production: false
// })
//
// const sendNotification = ({ deviceToken }) => {
//   const notification = new apn.Notification()
//   notification.topic = process.env.IOS_BUNDLE_ID
//   notification.expiry = ms('1h')
//   notification.badge = 1
//   notification.sound = 'ping.aiff'
//   notification.alert = 'Hello World \u270C'
//   notification.payload = { id: 123 }
//   apnProvider.send(notification, deviceToken)
//     .then(result => {
//       console.log(result)
//       return result
//     })
// }
//
// router.post('/send/:deviceToken', async (req, res) => {
//   const { deviceToken } = res.params
//   const deviceToken = '5311839E985FA01B56E7AD74444C0157F7F71A2745D0FB50DED665E0E882'
//   sendNotification(deviceToken)
// })

module.exports = router;