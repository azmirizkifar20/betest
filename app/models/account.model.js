module.exports = (mongoose) => {
    const AccountSchema = mongoose.Schema({
        accountId: {
            type: mongoose.Schema.Types.ObjectId,
            unique: true
        },
        userName: {
            type: String,
            unique: true,
            required: [true, 'Please add user name!']
        },
        password: {
            type: String,
            required: [true, 'Please add a password!']
        },
        lastLoginDateTime: {
            type: Date,
            default: Date.now
        },
        user: { // reference to User
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }, {
        timestamps: true
    })

    AccountSchema.index({ userName: 1 })

    // Middleware untuk menyetel userId sama dengan _id
    AccountSchema.pre('save', function(next) {
        if (!this.accountId) {
            this.accountId = this._id
        }
        next()
    })

    AccountSchema.method('toJSON', function() {
        const {__v, _id, ...object} = this.toObject()
        object.accountId = _id

        return object
    })

    return mongoose.model('Account', AccountSchema)
}