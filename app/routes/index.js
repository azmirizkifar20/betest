'use strict'
const dayjs = require('dayjs')
const router = require('express').Router()
const v1 = require('./v1/index')

/* GET home page. */
router.get('/', function(req, res, next) {
    res.status(200).json({
        welcome: "to btpn-betest",
        server_time: dayjs().toISOString()
    })
})

router.use('/v1', v1)

module.exports = router