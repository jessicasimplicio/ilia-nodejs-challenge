const express = require('express')

const app = express()
app.use(express.json())

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`Users microservice running on port ${PORT}`)
})

module.exports = app
