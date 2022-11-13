const jwt = require('jsonwebtoken')
const jwt_secret = process.env.JWT_SECRET_KEY
const validateKey = process.env.JWT_VALIDATE_KEY
const Response = require('../../utils/response')

exports.protect = async(req, res, next) => {
    let token

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    // memastikan kalau token dimasukkan
    if (!token) {
        return Response.send(res, 401, null, 'Not authorize to access this route')
    }

    try {
        const verify = jwt.verify(token, jwt_secret)

        // check validate key
        if (verify.validateKey == validateKey)
            next()
        else
            return Response.send(res, 401, null, 'Not authorize to access this route')
    } catch(err) {
        return Response.send(res, 401, null, 'Not authorize to access this route')
    }
}