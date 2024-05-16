const { check } = require('express-validator')

module.exports = {
    registration: [
        check('userName').isLength({ min: 6 }),
        check('password').isLength({ min: 6 }),
        check('password_confirm').isLength({ min: 6 }),
        check('fullName').isLength({ min: 6 }),
        check('emailAddress').isLength({ min: 6 }),
    ],
    login: [
        check('userName').isLength({ min: 6 }),
        check('password').isLength({ min: 6 }),
    ],
    refreshToken: [
        check('accountId').isLength({ min: 6 }),
    ],
}