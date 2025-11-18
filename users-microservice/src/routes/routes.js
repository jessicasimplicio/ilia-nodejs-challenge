const express = require('express')
const { registerUser } = require('../controllers/users')

const router = express.Router()

//public routes
router.post('/auth', registerUser)


module.exports = router
