const express = require('express')
const router = express.Router()
const ms = require('ms')
const apn = require('apn')
const joi = require('joi')
const { validate } = require('../helpers')
const Wc = require('../schemas/wc')
const ObjectId = require('mongoose').Types.ObjectId;
const Report = require('../schemas/report');

router.get('/', (req, res) => {
    const params = req.query;
    if('category' in params) {
        Wc.find({ categoryId: new ObjectId(params.category) }, (err, item) => {
            if(err) {
                console.error(err);
            }
            res.json({
                status: 'success',
                data: item
            });
        });
    } else {
        Wc.find((err, items) => {
            if (err) {
                console.error(err);
            }
            res.json({
                status: 'success',
                data: items
            });
        });
    }
});


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

/**
 * Report generator
 */
// const data = require('./data');
// const moment = require('moment');
// router.get('/gen', (req, res) => {
//     for (let item of data) {
//         if (item.status === 'occupied' || item.status === 'vacant') {
//             let report = new Report();
//             report.date = moment(item.date);
//             report.status = item.status === 'occupied' ? true : false;
//             report.wcId = new ObjectId('589e3bf575d52d722a3d2c08');
//             report.save();

//             let report2 = new Report();
//             report2.date = moment(item.date);
//             report2.status = item.status === 'occupied' ? false : true;
//             report2.wcId = new ObjectId('589e3cda75d52d722a3d2cda');
//             report2.save();
//         }
//     }
//     res.json({});
// });

router.put('/:token', (req, res) => {
    Wc.findOne({token: req.params.token}, (err, item) => {
        if ('banner' in req.body) {
            item.banner = req.body.banner;
        }
        if ('usageCount' in req.body) {
            item.usageCount = req.body.usageCount; // @todo validate in notifications
        }
        if ('inactivity' in req.body) {
            item.inactivity = req.body.inactivity; // @todo validate in notifications
        }

        item.save();

        res.json({
            status: 'success',
            data: item
        });
    });
});

router.get('/:token', (req, res) => {
    Wc.findOne({token: req.params.token}, (err, item) => {
        if (!item) {
            res.status(404);
            return res.json({
                status: 'error',
                message: 'Wc not found'
            });
        }
        if (err) {
            console.error(err);
        }
        res.json({
            status: 'success',
            data: item
        });
    });
});

module.exports = router;
