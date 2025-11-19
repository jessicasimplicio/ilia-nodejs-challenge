const express = require('express')
const conn = require('./db/conn')
const router = require('./routes/routes')

const app = express()
app.use(express.json())

conn()

app.use('/api/', router)

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`Users microservice running on port ${PORT}`)
})

module.exports = app
