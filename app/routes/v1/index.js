'use strict'
const router = require('express').Router()
const account = require('./account.routes')

router.use('/accounts', account)

module.exports = router