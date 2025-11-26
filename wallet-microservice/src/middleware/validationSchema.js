const { validationResult } = require('express-validator')

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const errorDetails = errors.array().map((error) => ({
      field: error.path,
      message: error.msg,
      value: error.value,
    }))

    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errorDetails,
    })
  }

  next()
}

module.exports = { handleValidationErrors }
