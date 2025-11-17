require('dotenv').config
const express = require('express')
const router = require('./routes/routes')
const conn = require('./db/conn')

const app = express()
app.use(express.json())

conn()

app.use('/', router)

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'Wallet Microservice' })
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Wallet microservice running on port ${PORT}`)
})

module.exports = app