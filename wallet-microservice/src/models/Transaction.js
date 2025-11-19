const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['CREDIT', 'DEBIT'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
})

module.exports = mongoose.model('Transaction', transactionSchema)
