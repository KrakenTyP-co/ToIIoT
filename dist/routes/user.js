'use strict';

var express = require('express');
var router = express.Router();
var joi = require('joi');

var _require = require('../models'),
    user = _require.user,
    company = _require.company;

var _require2 = require('../helpers'),
    validate = _require2.validate;

router.get('/', function (req, res) {
  user.scope('full').findAll().then(function (users) {
    return res.status(200).json(users);
  });
});

router.get('/:userId', function (req, res) {
  var userId = req.params.userId;

  user.scope('full').findById(userId).then(function (users) {
    if (!users) {
      return res.sendStatus(404);
    }
    return res.status(200).json(users);
  });
});

var expSchema = joi.object({
  email: joi.string().email().required(),
  first_name: joi.string().required()
}).required();

router.post('/', validate('body', expSchema), function (req, res) {
  user.create(req.body).then(function (user) {
    return res.status(201).json(user);
  }).catch(function (error) {
    return res.status(400).json(error);
  });
});

module.exports = router;