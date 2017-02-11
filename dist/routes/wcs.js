'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var express = require('express');
var router = express.Router();
var ms = require('ms');
var apn = require('apn');
var joi = require('joi');

var _require = require('../helpers'),
    validate = _require.validate;

var Wc = require('../schemas/wc');
var ObjectId = require('mongoose').Types.ObjectId;
var Report = require('../schemas/report');

router.get('/', function (req, res) {
  var params = req.query;
  if ('category' in params) {
    Wc.find({
      categoryId: new ObjectId(params.category)
    }, 'id categoryId status banner active', function (err, item) {
      if (err) {
        console.error(err);
      }
      res.json({
        status: 'success',
        data: item
      });
    });
  } else {
    Wc.find(function (err, items) {
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

router.get('/:wcId', function (req, res) {
  var wcId = req.params.wcId;

  Wc.findById(wcId, 'id categoryId status banner active').then(function (item) {
    if (!item) {
      return res.status(404).end();
    }
    return res.json({
      status: 'success',
      data: item
    });
  }).catch(function () {
    console.error(err);
  });
});

var apnProvider = new apn.Provider({
  token: {
    key: process.env.IOS_PATH_TO_P8_FILE,
    keyId: process.env.IOS_KEY_ID,
    teamId: process.env.IOS_TEAM_ID
  },
  production: false
});

var sendNotification = function sendNotification(deviceToken) {
  var notification = new apn.Notification();
  notification.topic = process.env.IOS_BUNDLE_ID;
  notification.expiry = ms('1h');
  notification.badge = 1;
  notification.sound = 'ping.aiff';
  notification.alert = 'Hello World \u270C';
  notification.payload = { id: 123 };
  return apnProvider.send(notification, deviceToken);
};

router.get('/:wcId/notify', function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(req, res) {
    var wcId, wc;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            wcId = res.params.wcId;
            wc = Wc.findById(wcId);

            Promise.all(wc.deviceTokens.map(sendNotification)).then(function (results) {
              console.log(results);
              res.sendStatus(204);
            }).catch(function (err) {
              return console.log(err);
            });

          case 3:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

var expSchema = joi.object({
  deviceToken: joi.string().required()
}).required();

router.post('/:wcId/subscribe', validate('body', expSchema), function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(req, res) {
    var deviceToken, adminWcId, adminWc, _wc, _wc2;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            deviceToken = req.body.deviceToken;

            if (req.headers['X-Auth-token']) {
              adminWcId = req.headers['X-Auth-token'];
              adminWc = Wc.find({ token: adminWcId });

              if (adminWc) {
                _wc = Wc.findById(wcId);

                _wc.adminDeviceTokens.push(deviceToken);
                _wc.save(function () {
                  return res.status(201).json();
                }).catch(function (err) {
                  return console.log(err);
                });
              }
            } else {
              _wc2 = Wc.findById(wcId);

              _wc2.deviceTokens.push(deviceToken);
              _wc2.save(function () {
                return res.status(201).json();
              }).catch(function (err) {
                return console.log(err);
              });
            }

          case 2:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());

router.post('/:wcId/unsubscribe', validate('body', expSchema), function () {
  var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(req, res) {
    var deviceToken, adminWcId, adminWc, deviceTokenIndex, _wc3, _deviceTokenIndex;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            deviceToken = req.body.deviceToken;

            if (!req.headers['X-Auth-token']) {
              _context3.next = 11;
              break;
            }

            adminWcId = req.headers['X-Auth-token'];
            adminWc = Wc.find({ token: adminWcId });

            if (adminWc) {
              _context3.next = 6;
              break;
            }

            return _context3.abrupt('return', res.sendStatus(404).end());

          case 6:
            deviceTokenIndex = wc.deviceTokens.findIndex();

            wc.deviceTokens = [].concat(_toConsumableArray(deviceToken.slice(0, deviceTokenIndex)), _toConsumableArray(deviceToken.slice(deviceTokenIndex + 1)));
            wc.save(function () {
              return res.status(201).json();
            }).catch(function (err) {
              return console.log(err);
            });
            _context3.next = 15;
            break;

          case 11:
            _wc3 = Wc.findById(wcId);
            _deviceTokenIndex = _wc3.deviceTokens.findIndex();

            _wc3.deviceTokens = [].concat(_toConsumableArray(deviceToken.slice(0, _deviceTokenIndex)), _toConsumableArray(deviceToken.slice(_deviceTokenIndex + 1)));
            _wc3.save(function () {
              return res.status(201).json();
            }).catch(function (err) {
              return console.log(err);
            });

          case 15:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());

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

router.put('/:token', function (req, res) {
  Wc.findOne({ token: req.params.token }, function (err, item) {
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

router.get('/:token', function (req, res) {
  Wc.findOne({ token: req.params.token }, function (err, item) {
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