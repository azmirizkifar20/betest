const { check } = require('express-validator')

module.exports = {
    createUser: [
        check('userName').isLength({ min: 6 }),
        check('accountNumber').isNumeric(),
        check('emailAddress').isLength({ min: 6 }),
        check('identityNumber').isLength({ min: 10 }),
    ],
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
}