'use strict'
const db = require('../models')

class UserService {

  constructor() {
    this.user = db.user
  }

  async createUser(userData) {
    const user = new this.user(userData);
    return await user.save();
  }

  async getUserBySpesificData(data) {
    return await this.user
      .findOne(data)
      .select(['-_id'])
  }
}

module.exports = new UserService()