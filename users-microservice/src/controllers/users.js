const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, password, email } = req.body.user

    console.log('LLLL', password)

    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ error: 'User already exists' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)
    user = {
      first_name,
      last_name,
      password: hashPassword,
      email,
    }

    const response = await User.create(user)

    const accessToken = jwt.sign(
      { id: response._id, email: response.email },
      process.env.JWT_SECRET || 'ILIACHALLENGE',
      { expiresIn: '5h' }
    )

    console.log('response', response)
    console.log('accessToken', accessToken)

    const formatedResponse = {
      user: {
        id: response._id.toString(),
        first_name: response.first_name,
        last_name: response.last_name,
        email: response.email,
      },
      access_token: accessToken,
    }

    res
      .status(201)
      .json({ response: formatedResponse, message: 'User registered' })
  } catch (err) {
    res.status(400).json({ message: 'Error when registering user', err })
  }
}

module.exports = { registerUser }
