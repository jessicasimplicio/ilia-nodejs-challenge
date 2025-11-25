const { HTTP_STATUS } = require('./constants/httpStatus')

const responseHandler = {
  success: (res, data, message = '', statusCode = HTTP_STATUS.OK) => {
    return res.status(statusCode).json({
      success: true,
      data,
      message,
    })
  },

  error: (res, message, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR) => {
    return res.status(statusCode).json({
      success: false,
      error: message,
    })
  },
}

module.exports = responseHandler
