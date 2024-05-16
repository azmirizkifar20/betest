const asyncHandler = require('express-async-handler')

const HttpException = require('./Exceptions')

const notFound = asyncHandler((req, res, next) => {
  throw new HttpException('API not found', 404, 'notFound')
})

module.exports = { notFound }
