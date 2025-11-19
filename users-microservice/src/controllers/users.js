const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const JWT_SECRET = process.env.JWT_SECRET

const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, password, email } = req.body.user

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)
    const user = {
      first_name,
      last_name,
      password: hashPassword,
      email,
    }

    const response = await User.create(user)

    const formatedResponse = {
      user: {
        id: response._id.toString(),
        first_name: response.first_name,
        last_name: response.last_name,
        email: response.email,
      },
    }

    res.status(201).json({ ...formatedResponse })
  } catch (err) {
    res.status(400).json({ message: 'Error when registering user', err })
  }
}

const loginUser = async (req, res) => {
  try {
    const { password, email } = req.body.user

    let user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ error: 'User doens`t exist' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid password' })
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

    res.status(200).json({ ...formatedResponse })
  } catch (err) {
    res.status(400).json({ message: 'Error when registering user', err })
  }
}

const findUsers = async (_req, res) => {
  try {
    const users = await User.find().select('-password -__v')

    res.status(200).json({ users })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const getUser = async (req, res) => {
  try {
    const id = req.params.id
    const user = await User.findOne({ _id: id }).select('-password')

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const response = {
      id: user._id.toString(),
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    }
    res.status(200).json({ response })
  } catch (err) {
    res.status(500).json({ error: err.message })
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
      return res.status(404).json({ error: 'User not found' })
    }

    const response = {
      id: user._id.toString(),
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    }
    res.status(200).json({ response })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id
    const user = await User.findByIdAndDelete({ _id: id })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    return res.status(204).json({ message: 'User deleted' })
  } catch (err) {
    return res.status(500).json({ error: err.message })
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
