const express = require('express')
const router = express.Router()
// const auth = require('../auth')


// router.use('/auth', require('./auth'))
// router.use('/user', auth.authenticate, auth.checkDomainRestriction('admin'), require('./user'))
router.use('/categories', require('./categories'));
router.use('/wc', require('./wcs'));
router.use('/reports', require('./reports'));

module.exports = router
