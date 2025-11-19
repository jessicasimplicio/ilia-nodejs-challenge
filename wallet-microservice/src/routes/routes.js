const express = require('express')
const {
  createTransaction,
  getBalance,
  getTransactions,
} = require('../controllers/transactions')

const router = express.Router()

router.post('/transactions', createTransaction)
router.get('/transactions', getTransactions)
router.get('/balance/:user_id', getBalance)

module.exports = router
