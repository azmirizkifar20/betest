const Response = require('../utils/response')

const handler = async (err, req, res, next) => {
  try {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    let errName = err.name
    let errResponse = {
      errors: err.errors,
      message: err.message,
      code: 500,
      data: null
    }

    switch (errName) {
      case 'notFound':
      case 'unauthorized':
      case 'badRequest':
        errResponse.code = err.status
        break
      case 'ValidationError':
        errResponse.code = 422
        errResponse.errors = err.errors
        break
      case 'MulterError':
        if (err.code === 'LIMIT_FILE_SIZE') {
          errResponse.message = 'Maximum file exceeded 5 MB'
          errResponse.code = 400
        } else if (err.code === 'LIMIT_FIELD_VALUE') {
          errResponse.message = 'Maximum input field exceeded 10 MB'
          errResponse.code = 400
        } else {
          errResponse.message = 'Something went wrong when uploading file'
        }
        break
      default:
        console.log('err.name', err.name)
        console.error(err)
        errResponse.message = "Ups, something went wrong, we'll fix it immediately"
        break
    }

    Response.send(
      res,
      errResponse.code,
      errResponse.data,
      errResponse.message,
      err.message
    )
  } catch (e) {
    console.error('Error while handling error :', e)
    Response.send(
      res,
      500,
      null,
      "Ups, something went wrong, we'll fix it immediately",
      e.message
    )
  }
}

module.exports = { handler }
