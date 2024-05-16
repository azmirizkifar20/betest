'use strict'
const redis = require('redis')
const config = require('../config/redis.config')

class CacheService {
  constructor() {
    this._client = redis.createClient({
      url: `redis://:${config.password}@${config.host}:${config.port}`,
    })

    this._client.on('connect', function() {
      console.log('Redis Connected!')
    })

    this._client.on('error', (error) => {
      console.error(error)
    })

    this._client.connect()
  }

  set = async(key, value, expirationInSecond = 1800) => {
    await this._client.set(key, value, {
      EX: expirationInSecond,
    })
  }

  get = async(key) => {
    const result = await this._client.get(key)
    return result
  }

  delete = (key) => {
    return this._client.del(key)
  }
}

module.exports = new CacheService()
