const mongoose = require('mongoose')
require('dotenv').config()

const connectDb = async () => {
  const uri = process.env.DATABASE_URL
  console.log('uri', uri)
  if (!uri) {
    throw new Error('Missing DATABASE_URL environment variable')
  }

  return mongoose.connect(uri)
}

module.exports = connectDb
