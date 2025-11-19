const express = require('express')
const {
  registerUser,
  loginUser,
  findUsers,
  getUser,
} = require('../controllers/users')
const auth = require('../middleware/auth')

const router = express.Router()

//public routes
router.post('/auth', loginUser)
router.post('/users', registerUser)

router.get('/users', auth, findUsers)
router.get('/users/:id', auth, getUser)

module.exports = router
