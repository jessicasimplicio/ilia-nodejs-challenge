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
const { handleValidationErrors } = require('../middleware/validationsSchema')
const {
  registerUserValidator,
  loginUserValidator,
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
} = require('../utils/validators/usersValidators')

const router = express.Router()

//public routes
router.post('/auth', loginUserValidator, handleValidationErrors, loginUser)
router.post(
  '/users',
  registerUserValidator,
  handleValidationErrors,
  registerUser
)

//private routes
router.get('/users', auth, findUsers)
router.get(
  '/users/:id',
  auth,
  getUserValidator,
  handleValidationErrors,
  getUser
)
router.patch(
  '/users/:id',
  auth,
  updateUserValidator,
  handleValidationErrors,
  updateUser
)
router.delete(
  '/users/:id',
  auth,
  deleteUserValidator,
  handleValidationErrors,
  deleteUser
)

module.exports = router
