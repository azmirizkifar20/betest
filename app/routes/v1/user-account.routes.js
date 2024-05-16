'use strict'
const router = require('express').Router()
const { protect } = require('../../middlewares/auth/auth')
const UserAccountController = require('../../controllers/user-account.controller')

router.put('/:account_id', protect, UserAccountController.updateUserInfo)
router.delete('/:account_id', protect, UserAccountController.deleteUserAccount)

router.get('/:account_id', protect, UserAccountController.getUserAccountInfo)
router.get('/:total_day/last-login', protect, UserAccountController.getLastLogin)
router.get('/:account_number/account-number', protect, UserAccountController.getUserByAccountNumber)
router.get('/:registration_number/register-number', protect, UserAccountController.getUserByRegistrationNumber)

module.exports = router