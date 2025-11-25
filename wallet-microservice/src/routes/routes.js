const express = require('express')
const {
  createTransaction,
  getBalance,
  getTransactions,
} = require('../controllers/transactions')
const { handleValidationErrors } = require('../middleware/validationSchema')
const {
  createTransactionValidator,
  getTransactionsValidator,
  getBalanceValidator,
} = require('../utils/validators/transactionSchemas')

const router = express.Router()

router.post(
  '/transactions',
  createTransactionValidator,
  handleValidationErrors,
  createTransaction
)
router.get(
  '/transactions',
  getTransactionsValidator,
  handleValidationErrors,
  getTransactions
)
router.get(
  '/balance/:user_id',
  getBalanceValidator,
  handleValidationErrors,
  getBalance
)

module.exports = router
