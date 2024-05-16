const Helpers = require('../utils/helpers')

module.exports = (mongoose) => {
    const UserSchema = mongoose.Schema({
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            unique: true
        },
        fullName: {
            type: String,
            required: [true, 'Please add full name!']
        },
        accountNumber: {
            type: String,
            unique: true,
            default: () => Helpers.generateRandomNumber(6)
        },
        emailAddress: {
            type: String,
            required: [true, 'Please add an email!'],
            unique: true,
            match: [
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                'Please add a valid email'
            ]
        },
        registrationNumber: {
            type: String,
            unique: true,
            default: () => Helpers.generateRandomNumber(12)
        }
    }, {
        timestamps: true
    })

    // define index
    UserSchema.index({ emailAddress: 1 })

    // Middleware untuk menyetel userId sama dengan _id
    UserSchema.pre('save', function(next) {
        if (!this.userId) {
            this.userId = this._id
        }
        next()
    })

    UserSchema.method('toJSON', function() {
        const {__v, _id, ...object} = this.toObject()
        object.userId = _id

        return object
    })

    return mongoose.model('User', UserSchema)
}