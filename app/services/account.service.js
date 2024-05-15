'use strict'
const dayjs = require('dayjs')
const db = require('../models')
const mongoose = require('mongoose')
const jwtConfig = require('../config/jwt.config')
const { hashPassword, isPasswordValid, createJwtToken } = require('../utils/helpers')

class AccountService {

  constructor() {
    this.user = db.user
    this.account = db.account
  }

  async createAccount(accountData) {
    const {
      userName,
      password,
      password_confirm,
      fullName,
      emailAddress
    } = accountData

    // validate password
    if (password !== password_confirm)
      throw new Error('Password do not match!')

    // hash password
    const hashedPassword = await hashPassword(password)

    // start transaction
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      // create new user
      let user = await new this.user({ fullName, emailAddress })
      user = await user.save({ session })

      // create new account
      let account = await new this.account({
        userName,
        password: hashedPassword,
        user: user.userId
      })
      account = await account.save({ session })

      // commit and end transction
      await session.commitTransaction()
      session.endSession()

      return await this.account
        .findById(account.accountId)
        .select(['-password', '-updatedAt'])
        .populate('user', '-_id -__v -updatedAt')
    } catch(err) {
      await session.abortTransaction()
      session.endSession()

      throw new Error(err)
    }
  }

  async login(userName, password) {
    // find account
    const account = await this.account
      .findOne({ userName })
      .select(['-_id'])
      .populate('user', '-_id -__v')

    if (!account)
      throw new Error('Invalid username or password')

    // compare password
    const isValid = await isPasswordValid(password, account.password)
    if (!isValid)
      throw new Error('Invalid username or password')

    // need to convert mongodb obj to js obj (for signing jwt)
    const accountData = JSON.parse(JSON.stringify(account))

    // remove key password
    delete accountData.password

    // create JWT token (return: accessToken, data)
    return await createJwtToken(accountData, jwtConfig.secret, jwtConfig.expiresIn)
  }

  async getAccountsByLastLoginDateTime(days) {
    const date = dayjs().subtract(days, 'day').toDate()
    return await this.account.find({ lastLoginDateTime: { $lt: date } })
  }
}

module.exports = new AccountService()