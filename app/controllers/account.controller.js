'use strict'
const Response = require('../utils/response')
const userService = require('../services/user.service')
const accountService = require('../services/account.service')

class AccountController {
  /*
    ===========================================================================================
    request raw data contains :
    userName, password, password_confirm, fullName, emailAddress
    ===========================================================================================
  */
  async register(req, res) {
    try {
      const registrationData = await accountService.createAccount(req.body)
      return Response.send(res, 201, registrationData, 'Successfully create user!')
    } catch (err) {
      return Response.send(res, 500, null, "Internal Server Error", err.message)
    }
  }

  /*
    ===========================================================================================
    request raw data contains :
    userName, password
    ===========================================================================================
  */
  async login(req, res) {
    try {
      // get raw data
      const {
        userName,
        password
      } = req.body

      const loginData = await accountService.login(userName, password)
      return Response.send(res, 201, loginData, 'Successfully login!')
    } catch (err) {
      return Response.send(res, 500, null, "Internal Server Error", err.message)
    }
  }

  /*
    ===========================================================================================
    request path params contains :
    account_number
    ===========================================================================================
  */
  async getUserByAccountNumber(req, res) {
    try {
      const user = await userService.getUserBySpesificData({
        accountNumber: req.params.account_number
      })

      if (!user)
        return Response.send(res, 404, null, "No data found!", 'data user not found!')

      return Response.send(res, 200, user, 'Successfully get user!')
    } catch (err) {
      return Response.send(res, 500, null, "Internal Server Error", err.message)
    }
  }

  /*
    ===========================================================================================
    request path params contains :
    registration_number
    ===========================================================================================
  */
  async getUserByRegistrationNumber(req, res) {
    try {
      const user = await userService.getUserBySpesificData({
        registrationNumber: req.params.registration_number
      })

      if (!user)
        return Response.send(res, 404, null, "No data found!", 'data user not found!')

      return Response.send(res, 200, user, 'Successfully get user!')
    } catch (err) {
      return Response.send(res, 500, null, "Internal Server Error", err.message)
    }
  }

  async getLastLogin(req, res) {
    try {
      const user = await accountService.getAccountsByLastLoginDateTime(3)

      if (!user)
        return Response.send(res, 404, null, "No data found!", 'data user not found!')

      return Response.send(res, 200, user, 'Successfully get users!')
    } catch (err) {
      return Response.send(res, 500, null, "Internal Server Error", err.message)
    }
  }
}

module.exports = new AccountController()