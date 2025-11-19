const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET

const auth = (req, res, next) => {
  const token = req.headers.authorization

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Access token is missing or invalid' })
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res
      .status(401)
      .json({ message: 'Access token is missing or invalid', err })
  }
}

module.exports = auth
