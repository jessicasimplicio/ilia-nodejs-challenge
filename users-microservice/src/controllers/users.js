const userService = require('../services/userService')
const jwt = require('jsonwebtoken')
const { HTTP_STATUS, ERROR_MESSAGES } = require('../utils/constants/httpStatus')
const responseHandler = require('../utils/responseHandler')

const JWT_SECRET = process.env.JWT_SECRET

const registerUser = async (req, res) => {
  try {
    const userData = req.body.user
    const user = await userService.registerUser(userData)

    responseHandler.success(
      res,
      { user },
      'User registered successfully',
      HTTP_STATUS.CREATED
    )
  } catch (err) {
    const message =
      ERROR_MESSAGES[err.message] || ERROR_MESSAGES.REGISTRATION_FAILED
    const status =
      err.message === 'USER_ALREADY_EXISTS'
        ? HTTP_STATUS.BAD_REQUEST
        : HTTP_STATUS.INTERNAL_SERVER_ERROR

    responseHandler.error(res, message, status)
  }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body.user
    const user = await userService.loginUser(email, password)

    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '5h' }
    )

    responseHandler.success(
      res,
      { user, access_token: accessToken },
      'Login successful'
    )
  } catch (err) {
    const message =
      ERROR_MESSAGES[err.message] || ERROR_MESSAGES.INVALID_CREDENTIALS
    responseHandler.error(res, message, HTTP_STATUS.UNAUTHORIZED)
  }
}

const getUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id)
    responseHandler.success(res, { user })
  } catch (err) {
    const message = ERROR_MESSAGES[err.message] || ERROR_MESSAGES.USER_NOT_FOUND
    responseHandler.error(res, message, HTTP_STATUS.NOT_FOUND)
  }
}

const findUsers = async (_req, res) => {
  try {
    const users = await userService.getAllUsers()
    responseHandler.success(res, { users })
  } catch (err) {
    responseHandler.error(res, err.message, HTTP_STATUS.INTERNAL_SERVER_ERROR)
  }
}

const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body)
    responseHandler.success(res, { user }, 'User updated successfully')
  } catch (err) {
    const message = ERROR_MESSAGES[err.message] || ERROR_MESSAGES.USER_NOT_FOUND
    responseHandler.error(res, message, HTTP_STATUS.NOT_FOUND)
  }
}

const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id)
    responseHandler.success(
      res,
      null,
      'User deleted successfully',
      HTTP_STATUS.NO_CONTENT
    )
  } catch (err) {
    const message = ERROR_MESSAGES[err.message] || ERROR_MESSAGES.USER_NOT_FOUND
    responseHandler.error(res, message, HTTP_STATUS.NOT_FOUND)
  }
}

module.exports = {
  registerUser,
  loginUser,
  findUsers,
  getUser,
  updateUser,
  deleteUser,
}
