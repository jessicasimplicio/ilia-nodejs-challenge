const express = require('express')
const { registerUser, loginUser } = require('../controllers/users')

const router = express.Router()

//public routes
router.post('/auth', loginUser)
router.post('/users', registerUser)

module.exports = router
