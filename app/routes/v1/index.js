'use strict'
const router = require('express').Router()
const auth = require('./auth.routes')
const account = require('./user-account.routes')

router.use('/auth', auth)
router.use('/accounts', account)

module.exports = router