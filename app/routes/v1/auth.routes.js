'use strict'
const router = require('express').Router()
const validate = require('../../middlewares/validators')
const rules = require('../../middlewares/validators/rules/user.rule')
const AuthController = require('../../controllers/auth.controller')

router.post('/login', rules.login, validate, AuthController.login)
router.post('/register', rules.registration, validate, AuthController.register)
router.post('/refresh-token', rules.refreshToken, validate, AuthController.refreshToken)

module.exports = router