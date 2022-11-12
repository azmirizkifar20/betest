'use strict';
const Response = require('../../utils/response')
const { validationResult } = require('express-validator')

/**
 * Middleware that applies express validator on the validation rules.
 *
 * @param {object} req The request object
 * @param {object} res The response object
 * @param {func} next The next function
 * @returns next function if there's no error and the error object if there's a validation error
 */

module.exports = function validate (req, res, next) {
    try {
        const errors = validationResult(req)
        if (errors.isEmpty()) {
            return next()
        }

        return Response.send(res, 400, null, 'Something went wrong on your form!', errors.array())
    } catch (err) {
        return Response.send(res, 500, null, "Internal Server Error", err.message)
    }
}
