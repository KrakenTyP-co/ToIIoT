'use strict';

var express = require('express');
var router = express.Router();

// router.use('/auth', require('./auth'))
// router.use('/user', auth.authenticate, auth.checkDomainRestriction('admin'), require('./user'))
router.use('/categories', require('./categories'));
router.use('/wc', require('./wcs'));
router.use('/notifications', require('./notifications'));

module.exports = router;