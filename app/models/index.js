const mongoose = require('mongoose')

module.exports = {
    user: require('./user.model')(mongoose),
    account: require('./account.model')(mongoose)
}