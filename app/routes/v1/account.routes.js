'use strict'
const router = require('express').Router()
const validate = require('../../middlewares/validators')
const rules = require('../../middlewares/validators/rules/user.rule')
const AccountController = require('../../controllers/account.controller')

router.get('/last-login', AccountController.getLastLogin)
router.post('/login', rules.login, validate, AccountController.login)
router.post('/register', rules.registration, validate, AccountController.register)
router.get('/:account_number/account-number', AccountController.getUserByAccountNumber)
router.get('/:registration_number/register-number', AccountController.getUserByRegistrationNumber)

module.exports = router