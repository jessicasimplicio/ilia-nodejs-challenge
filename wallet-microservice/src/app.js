require('dotenv').config()
const express = require('express')
const router = require('./routes/routes')
const conn = require('./db/conn')
const auth = require('./middleware/auth')

const PORT = process.env.PORT

const app = express()
app.use(express.json())

conn()

app.use('/api/', auth, router)

app.listen(PORT, () => {
  console.log(`Wallet microservice running on port ${PORT}`)
})

module.exports = app
