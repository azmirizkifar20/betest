'use strict'
const Response = require('../utils/response')
const userService = require('../services/user.service')
const cacheService = require('../services/cache.service')
const accountService = require('../services/account.service')
const asyncHandler = require('express-async-handler')

class UserAccountController {
  /*
    ===========================================================================================
    Method: GET
    URL Path: /v1/accounts/:account_id

    request path params contains :
    account_id
    ===========================================================================================
  */
  getUserAccountInfo = asyncHandler(async(req, res) => {
    // get params data
    const accountId = req.params.account_id

    // check availability data from redis
    const cacheUser = await cacheService.get(`account:${accountId}`)
    if (cacheUser != null)
      return Response.send(res, 200, { cache: true, user: JSON.parse(cacheUser) }, "Success!", 'Successfully get user account!')

    // get data from db
    const account = await accountService.getAccountInfo(accountId)
    if (!account)
      return Response.send(res, 404, null, "No data found!", 'data user not found!')

    // set data to redis
    await cacheService.set(`account:${accountId}`, JSON.stringify(account))

    return Response.send(res, 200, { cache: false, user: account }, 'Successfully get user account!')
  })

  /*
    ===========================================================================================
    Method: PUT
    URL Path: /v1/accounts/:account_id

    request raw data contains :
    fullName, emailAddress
    ===========================================================================================
  */
  updateUserInfo = asyncHandler(async(req, res) => {
    // get path params & raw data
    const accountId = req.params.account_id
    const { fullName, emailAddress } = req.body

    // get user by accountId
    const account = await accountService.getAccountInfo(accountId)
    if (!account)
      return Response.send(res, 404, null, "No data found!", 'data user not found!')

    // update user info
    await userService.updateUser(account.user.userId, { fullName, emailAddress })

    // get final user account data
    const finaluserAccount = await accountService.getAccountInfo(accountId)

    // re-set data to redis
    await cacheService.set(`account:${accountId}`, JSON.stringify(finaluserAccount))

    return Response.send(res, 200, finaluserAccount, 'Successfully get user!')
  })

  /*
    ===========================================================================================
    Method: DELETE
    URL Path: /v1/accounts/:account_id

    request path params contains :
    account_id
    ===========================================================================================
  */
  deleteUserAccount = asyncHandler(async(req, res) => {
    // get params data
    const accountId = req.params.account_id

    // delete User and Account
    await accountService.deleteUserAccount(accountId)

    // delete cache data
    await cacheService.delete(`account:${accountId}`)
    return Response.send(res, 200, null, 'Successfully delete user!')
  })

  /*
    ===========================================================================================
    Method: GET
    URL Path: /v1/accounts/:account_number/account-number

    request path params contains :
    account_number
    ===========================================================================================
  */
  getUserByAccountNumber = asyncHandler(async(req, res) => {
    const user = await userService.getUserBySpesificData({
      accountNumber: req.params.account_number
    })

    if (!user)
      return Response.send(res, 404, null, "No data found!", 'data user not found!')

    return Response.send(res, 200, user, 'Successfully get user!')
  })

  /*
    ===========================================================================================
    Method: GET
    URL Path: /v1/accounts/:registration_number/register-number

    request path params contains :
    registration_number
    ===========================================================================================
  */
  getUserByRegistrationNumber = asyncHandler(async(req, res) => {
    const user = await userService.getUserBySpesificData({
      registrationNumber: req.params.registration_number
    })

    if (!user)
      return Response.send(res, 404, null, "No data found!", 'data user not found!')

    return Response.send(res, 200, user, 'Successfully get user!')
  })

  /*
    ===========================================================================================
    Method: GET
    URL Path: /v1/accounts/:total_day/last-login
    ===========================================================================================
  */
  getLastLogin = asyncHandler(async(req, res) => {
    // get total day & validate is number
    let totalDayInNumber = Number.parseInt(req.params.total_day)
    if (Number.isNaN(totalDayInNumber)) {
      totalDayInNumber = 0
    }

    const user = await accountService.getAccountsByLastLoginDateTime(totalDayInNumber)

    if (!user)
      return Response.send(res, 404, null, "No data found!", 'data user not found!')

    return Response.send(res, 200, user, 'Successfully get users!')
  })
}

module.exports = new UserAccountController()