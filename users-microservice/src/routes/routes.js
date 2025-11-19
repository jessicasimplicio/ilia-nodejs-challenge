const express = require('express')
const {
  registerUser,
  loginUser,
  findUsers,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/users')
const auth = require('../middleware/auth')

const router = express.Router()

//public routes
router.post('/auth', loginUser)
router.post('/users', registerUser)

//private routes
router.get('/users', auth, findUsers)
router.get('/users/:id', auth, getUser)
router.patch('/users/:id', auth, updateUser)
router.delete('/users/:id', auth, deleteUser)

module.exports = router
