const express = require('express')
const router = express.Router()
const ms = require('ms')
const apn = require('apn')
const joi = require('joi')
const { validate } = require('../helpers')
const Wc = require('../schemas/wc')
const moment = require('moment');
const ObjectId = require('mongoose').Types.ObjectId;
const Report = require('../schemas/report');

import { Counter } from '../generator/counter';
let counter = new Counter();
counter.notificationFunction = (wcId, count) => {}; // @todo here register call function

router.get('/', (req, res) => {
    const params = req.query
    if ('category' in params) {
        try {
            let objId = new ObjectId(params.category);
            Wc.find({ categoryId: objId }, (err, item) => {
                if (err) {
                    console.error(err);
                }
                res.json({
                    status: 'success',
                    data: item
                });
            });
        } catch (e) {
            res.status(400).json({
                status: 'error',
                message: 'Invalid category'
            });
        }
    } else {
        Wc.find((err, items) => {
            if (err) {
                console.error(err)
            }
            res.json({
                status: 'success',
                data: items
            })
        })
    }
})

router.get('/:wcId', (req, res) => {
    const { wcId } = req.params
    Wc.findById(wcId, 'id categoryId status banner active')
        .then(item => {
            if (!item) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Wc not found'
                });
            }
            return res.json({
                status: 'success',
                data: item
            })
        })
        .catch(() => {
            return res.status(400).json({
                status: 'error',
                message: 'Wrong wc id'
            })
        })
})

const apnProvider = new apn.Provider({
    token: {
        key: process.env.IOS_PATH_TO_P8_FILE,
        keyId: process.env.IOS_KEY_ID,
        teamId: process.env.IOS_TEAM_ID
    },
    production: false
})

const sendNotification = ({ deviceToken, title, _id }) => {
    const notification = new apn.Notification()
    notification.topic = process.env.IOS_BUNDLE_ID
    notification.expiry = ms('1h')
    notification.badge = 1
    notification.sound = 'ping.aiff'
    notification.alert = `WC ${title} is vacant.`
    notification.payload = { id: _id }
    return apnProvider.send(notification, deviceToken)
}

const notifyDevices = ({ wcId }) => {
  return Wc.findById(wcId)
  .then(wc => {
    return Promise.all(wc.deviceTokens.map(deviceToken => {
      return sendNotification(wc)
    }))
  })
}

router.get('/:wcId/notify', (req, res) => {
  const { wcId } = req.params
  notifyDevices({ wcId })
  .then((results) => {
    console.log(results)
    return res.status(200).json(results).end()
  })
  .catch(err => console.log(err))
})

router.post('/:wcId/notify', (req, res) => {
  if ('status' in req.body) {
    counter.dbWrite(req.params.wcId, req.body.status);
    if (req.body.status === false) {
        notifyDevices({ wcId })
            .then((results) => {
                console.log(results)
                return res.status(200).json({
                    status: 'success',
                    data: results
                }).end()
            })
            .catch(err => console.log(err))
    }
  }
})

router.get('/:wcId/last', (req, res) => {
    try {
        if ('from' in req.query) {
            Report.find({
                wcId: new ObjectId(req.params.wcId),
                date: {
                    $gte: moment(req.query.from).toDate()
                }
            })
                .then((items) => {
                    res.json({
                        status: 'success',
                        reports: items || []
                    });
                })
                .catch(() => {
                    return res.status(400).json({
                        status: 'error',
                        message: 'Wrong wc id or device is offline'
                    })
                });
        } else {
            res.json({
                status: 'success',
                reports: []
            });
        }
    } catch (e) {
        return res.status(400).json({
            status: 'error',
            message: 'Something goes wrong (wcid, date format or device is offline)'
        })
    }
});

const expSchema = joi.object({
    deviceToken: joi.string().required()
}).required()

router.post('/:wcId/subscribe', validate('body', expSchema), (req, res) => {
  const { deviceToken } = req.body
  console.log('deviceToken', deviceToken);
  const { wcId } = req.params
  if (req.headers['X-Auth-token']) {
    const adminWcId = req.headers['X-Auth-token']
    Wc.find({ token: adminWcId })
    .then(wc => {
      if(!wc) {
        return res.sendStatus(404).end()
      }
      wc.adminDeviceTokens.push(deviceToken)
    })
    .then(() => {
      res.sendStatus(201).end()
    })
    .catch(err => console.log(err))
  } else {
    Wc.findById(wcId)
    .then(wc => {
      if(!wc) {
        return res.sendStatus(404).end()
      }
      wc.deviceTokens.push(deviceToken)
      return wc.save()
    })
    .then(() => {
      return res.sendStatus(204).end()
    })
    .catch(err => {
      console.log(err)
      res.sendStatus(500)
    })
  }
})

router.post('/:wcId/unsubscribe', validate('body', expSchema), (req, res) => {
    const { deviceToken } = req.body
    const { wcId } = req.params
    if (req.headers['X-Auth-token']) {
        const adminWcId = req.headers['X-Auth-token']
        Wc.find({ token: adminWcId })
            .then(wc => {
                if (!wc) {
                    return res.sendStatus(404).end()
                }
                const deviceTokenIndex = wc.adminDeviceTokens.findIndex(deviceToken)
                if (deviceTokenIndex === -1) {
                    return res.sendStatus(404).end()
                }
                wc.adminDeviceTokens = [
                    ...wc.adminDeviceTokens.slice(0, deviceTokenIndex),
                    ...wc.adminDeviceTokens.slice(deviceTokenIndex + 1)
                ]
                return wc.save()
            })
            .then(() => res.sendStatus(201).end())
            .catch(err => {
                console.log(err)
                res.sendStatus(500)
            })
    } else {
        Wc.findById(wcId)
            .then(wc => {
                const deviceTokenIndex = wc.deviceTokens.indexOf(deviceToken)
                if (deviceTokenIndex === -1) {
                    return res.sendStatus(404).end()
                }
                wc.deviceTokens = [
                    ...wc.deviceTokens.slice(0, deviceTokenIndex),
                    ...wc.deviceTokens.slice(deviceTokenIndex + 1)
                ]
                return wc.save()
            })
            .then(() => res.sendStatus(204).end())
            .catch(err => {
                console.log(err)
                res.sendStatus(500)
            })
    }
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

router.put('/:wcId', (req, res) => {
    Wc.findById(req.params.wcId)
        .then(item => {
            if (!item) {
                res.status(404);
                return res.json({
                    status: 'error',
                    message: 'Wc not found'
                });
            }
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
        })
        .catch(() => {
            return res.status(400).json({
                status: 'error',
                message: 'Wrong wc id'
            })
        });
});


router.put('/token/:token', (req, res) => {
    Wc.findOne({ token: req.params.token }, (err, item) => {
        if(!item) {
            res.status(404);
            return res.json({
                status: 'error',
                message: 'Wc not found'
            });
        }
        if ('banner' in req.body) {
            item.banner = req.body.banner;
        }
        if ('usageCount' in req.body) {
            item.usageCount = req.body.usageCount;
        }
        if ('inactivity' in req.body) {
            item.inactivity = req.body.inactivity;
        }

        item.save();

        res.json({
            status: 'success',
            data: item
        });
    });
});

module.exports = router;
