'use strict';
const express = require('express')
const router = express.Router()
const validate = require('../../middlewares/validators')
const rules = require('../../middlewares/validators/rules/user.rule')
const UserController = require('../../controllers/user.controller')
const { protect } = require('../../middlewares/auth/auth')

router.get('/', protect, UserController.get)
router.get('/:id', protect, UserController.getSingle)
router.get('/:key_name/:key_value', protect, UserController.getSingleByKey)

router.put('/:id', protect, UserController.update)
router.delete('/:id', protect, UserController.delete)
router.post('/token', UserController.generateToken)
router.post('/', protect, rules.createUser, validate, UserController.create)

module.exports = router