'use strict'
const Response = require('../utils/response')
const asyncHandler = require('express-async-handler')
const accountService = require('../services/account.service')

class AuthController {
  /*
    ===========================================================================================
    Method: POST
    URL Path: /v1/auth/register

    request raw data contains :
    userName, password, password_confirm, fullName, emailAddress
    ===========================================================================================
  */
  register = asyncHandler(async(req, res) => {
    const registrationData = await accountService.createAccount(req.body)
    return Response.send(res, 201, registrationData, 'Successfully create user!')
  })

  /*
    ===========================================================================================
    Method: POST
    URL Path: /v1/auth/login

    request raw data contains :
    userName, password
    ===========================================================================================
  */
  login = asyncHandler(async(req, res) => {
    // get raw data
    const {
      userName,
      password
    } = req.body

    const loginData = await accountService.login(userName, password)

    // remove validate key
    delete loginData.account.validateKey

    return Response.send(res, 201, loginData, 'Successfully login!')
  })

  /*
    ===========================================================================================
    Method: POST
    URL Path: /v1/auth/refresh-token

    request raw data contains :
    accountId
    ===========================================================================================
  */
    refreshToken = asyncHandler(async(req, res) => {
      // get raw data
      const { accountId } = req.body

      const token = await accountService.generateToken(accountId)
      return Response.send(res, 201, token, 'Successfully refresh token!')
    })
}

module.exports = new AuthController()