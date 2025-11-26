const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const walletService = require('../services/walletServices')
const { HTTP_STATUS, ERROR_MESSAGES } = require('../utils/constants/httpStatus')
const responseHandler = require('../utils/responseHandler')

const JWT_SECRET = process.env.JWT_SECRET

const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, password, email } = req.body.user

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return responseHandler.error(
        res,
        ERROR_MESSAGES.USER_ALREADY_EXISTS,
        HTTP_STATUS.BAD_REQUEST
      )
    }

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)
    const user = {
      first_name,
      last_name,
      password: hashPassword,
      email,
    }

    const response = await User.create(user)

    try {
      await walletService.createFirstTransaction(response._id.toString())
    } catch (err) {
      console.log(
        'Wallet initialization failed, but user was created. Error: ',
        err.message
      )
    }

    const formatedResponse = {
      user: {
        id: response._id.toString(),
        first_name: response.first_name,
        last_name: response.last_name,
        email: response.email,
      },
    }

    responseHandler.success(
      res,
      formatedResponse,
      'User registered successfully',
      HTTP_STATUS.CREATED
    )
  } catch (err) {
    responseHandler.error(
      res,
      ERROR_MESSAGES.REGISTRATION_FAILED,
      HTTP_STATUS.BAD_REQUEST
    )
  }
}

const loginUser = async (req, res) => {
  try {
    const { password, email } = req.body.user

    let user = await User.findOne({ email })
    if (!user) {
      return responseHandler.error(
        res,
        ERROR_MESSAGES.INVALID_CREDENTIALS,
        HTTP_STATUS.UNAUTHORIZED
      )
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return responseHandler.error(
        res,
        ERROR_MESSAGES.INVALID_CREDENTIALS,
        HTTP_STATUS.UNAUTHORIZED
      )
    }

    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '5h' }
    )

    const formatedResponse = {
      user: {
        id: user._id.toString(),
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      },
      access_token: accessToken,
    }

    responseHandler.success(res, formatedResponse, 'Login successful')
  } catch (err) {
    responseHandler.error(
      res,
      ERROR_MESSAGES.REGISTRATION_FAILED,
      HTTP_STATUS.BAD_REQUEST
    )
  }
}

const findUsers = async (_req, res) => {
  try {
    const users = await User.find().select('-password -__v')

    responseHandler.success(res, { users })
  } catch (err) {
    responseHandler.error(res, err.message, HTTP_STATUS.INTERNAL_SERVER_ERROR)
  }
}

const getUser = async (req, res) => {
  try {
    const id = req.params.id
    const user = await User.findOne({ _id: id }).select('-password')

    if (!user) {
      return responseHandler.error(
        res,
        ERROR_MESSAGES.USER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      )
    }

    const response = {
      id: user._id.toString(),
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    }
    responseHandler.success(res, { user: response })
  } catch (err) {
    responseHandler.error(res, err.message, HTTP_STATUS.INTERNAL_SERVER_ERROR)
  }
}

const updateUser = async (req, res) => {
  try {
    const { first_name, last_name, email } = req.body

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { first_name, last_name, email },
      { new: true, runValidators: true }
    ).select('-password')

    if (!user) {
      return responseHandler.error(
        res,
        ERROR_MESSAGES.USER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      )
    }

    const response = {
      id: user._id.toString(),
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    }

    responseHandler.success(
      res,
      { user: response },
      'User updated successfully'
    )
  } catch (err) {
    responseHandler.error(res, err.message, HTTP_STATUS.INTERNAL_SERVER_ERROR)
  }
}

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id
    const user = await User.findByIdAndDelete({ _id: id })
    if (!user) {
      return responseHandler.error(
        res,
        ERROR_MESSAGES.USER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      )
    }

    responseHandler.success(
      res,
      null,
      'User deleted successfully',
      HTTP_STATUS.NO_CONTENT
    )
  } catch (err) {
    responseHandler.error(res, err.message, HTTP_STATUS.INTERNAL_SERVER_ERROR)
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


