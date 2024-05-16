'use strict'
const db = require('../models')

class UserService {

  constructor() {
    this.user = db.user
  }

  getUserBySpesificData = async(data) => {
    return await this.user
      .findOne(data)
      .select(['-_id'])
  }

  updateUser = async(userId, data) => {
    return await this.user
      .findByIdAndUpdate(userId, data, { new: true })
  }
}

module.exports = new UserService()