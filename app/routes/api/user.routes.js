'use strict';
const express = require('express')
const router = express.Router()
const validate = require('../../middlewares/validators')
const rules = require('../../middlewares/validators/rules/user.rule')
const UserController = require('../../controllers/user.controller')

router.get('/', UserController.get)
router.get('/:id', UserController.getSingle)
router.get('/:key_name/:key_value', UserController.getSingleByKey)

router.put('/:id', UserController.update)
router.delete('/:id', UserController.delete)
router.post('/', rules.createUser, validate, UserController.create)

module.exports = router