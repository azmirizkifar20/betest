const { check } = require('express-validator')

    /* 
        ===========================================================================================
        request raw data contains : 
        userName, accountNumber, emailAddress, identityNumber
        ===========================================================================================
    */
module.exports = {
    createUser: [
        check('userName').isLength({ min: 6 }),
        check('accountNumber').isNumeric(),
        check('emailAddress').isLength({ min: 6 }),
        check('identityNumber').isLength({ min: 10 }),
    ]
}