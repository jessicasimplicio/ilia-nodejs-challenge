const jwt = require('jsonwebtoken')

const JWT_INTERNAL_SECRET = process.env.JWT_INTERNAL_SECRET
const JWT_SECRET = process.env.JWT_SECRET

const auth = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '')

  if (!token) {
    return res.status(401).json({ error: 'Access token is missing or invalid' })
  }

  try {
    const decoded = jwt.verify(token, JWT_INTERNAL_SECRET)
    req.user = { id: decoded.user_id || decoded.service }
    return next()
  } catch {
    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      req.user = decoded
      return next()
    } catch {
      return res
        .status(401)
        .json({ error: 'Access token is missing or invalid' })
    }
  }
}

module.exports = auth
