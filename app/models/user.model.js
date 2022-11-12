module.exports = (mongoose) => {
    const UserSchema = mongoose.Schema({
        userName: {
            type: String,
            required: [true, 'Please add username!']
        },
        accountNumber: {
            type: String,
            unique: true,
            required: [true, 'Please add account number!']
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
        identityNumber: {
            type: String,
            unique: true,
            required: [true, 'Please add identity number!'],
            maxlength: [20, 'Identity number can not be more than 20 characters']
        }
    }, {
        timestamps: true
    })

    UserSchema.method('toJSON', function() {
        const {__v, _id, ...object} = this.toObject()
        object.id = _id

        return object
    })

    return mongoose.model('User', UserSchema)
}