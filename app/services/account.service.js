'use strict'
const dayjs = require('dayjs')
const db = require('../models')
const jwtConfig = require('../config/jwt.config')
const { hashPassword, isPasswordValid, createJwtToken } = require('../utils/helpers')

class AccountService {

  constructor() {
    this.user = db.user
    this.account = db.account
  }

  createAccount = async(accountData) => {
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

    // create new user
    const user = await this.user.create({ fullName, emailAddress })

    // create new account
    const account = await this.account.create({
      userName,
      password: hashedPassword,
      user: user.userId
    })

    return await this.account
      .findById(account.accountId)
      .select(['-password', '-updatedAt'])
      .populate('user', '-_id -__v -updatedAt')
  }

  login = async(userName, password) => {
    // find account
    const account = await this.account
      .findOne({ userName })
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

    // add validate key
    accountData.validateKey = process.env.JWT_VALIDATE_KEY

    // update lastLoginDateTime to current date
    await this.account.updateOne(
      { accountId: account.accountId },
      { lastLoginDateTime: dayjs().toDate() }
    )

    // create JWT token (return: accessToken, data)
    return await createJwtToken(accountData, jwtConfig.secret, jwtConfig.expiresIn)
  }

  generateToken = async(accountId) => {
    // find account
    const account = await this.account
      .findById(accountId)
      .select(['-_id', '-password'])
      .populate('user', '-_id -__v')

    if (!account)
      throw new Error('Invalid accountId!')

    // need to convert mongodb obj to js obj (for signing jwt)
    const accountData = JSON.parse(JSON.stringify(account))

    // add validate key
    accountData.validateKey = process.env.JWT_VALIDATE_KEY

    // create JWT token (return: accessToken, data)
    const generatedToken = await createJwtToken(accountData, jwtConfig.secret, jwtConfig.expiresIn)

    return generatedToken.accessToken
  }

  getAccountInfo = async(accountId) => {
    return await this.account
      .findById(accountId)
      .select(['-password'])
      .populate('user', '-_id -__v')
  }

  getAccountsByLastLoginDateTime = async(days) => {
    const date = dayjs().subtract(days, 'day').toDate()
    return await this.account.find({ lastLoginDateTime: { $lt: date } })
  }

  deleteUserAccount = async(accountId) => {
    // get data account & delete data
    const account = await this.account.findByIdAndDelete(accountId)
    if (!account) throw new Error('Invalid accountId!')

    // delete user data
    await this.user.findByIdAndDelete(account.user)

    return true
  }
}

module.exports = new AccountService()