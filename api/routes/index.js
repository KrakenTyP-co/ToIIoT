const express = require('express')
const router = express.Router()
const auth = require('../auth')

router.use('/auth', require('./auth'))
router.use('/user', auth.authenticate, auth.checkDomainRestriction('admin'), require('./user'))

module.exports = router
