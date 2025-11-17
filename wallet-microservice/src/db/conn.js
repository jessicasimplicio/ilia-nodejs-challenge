const mongoose = require('mongoose')
require('dotenv').config()

const main = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL)
        console.log("DB is connected")
    }catch(err){
        console.log('Error:', err)
    }
}

module.exports = main