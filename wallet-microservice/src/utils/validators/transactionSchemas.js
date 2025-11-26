const { body, query, param } = require('express-validator')

const createTransactionValidator = [
  body('user_id')
    .notEmpty()
    .withMessage('User ID is required')
    .isString()
    .withMessage('User ID must be a string'),

  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number')
    .custom((value) => {
      if (value <= 0) {
        throw new Error('Amount must be greater than 0')
      }
      return true
    }),

  body('type')
    .isIn(['CREDIT', 'DEBIT'])
    .withMessage("Type must be 'CREDIT' or 'DEBIT'"),
]

const getTransactionsValidator = [
  query('type')
    .isIn(['CREDIT', 'DEBIT'])
    .withMessage("Type must be 'CREDIT' or 'DEBIT'"),
]

const getBalanceValidator = [
  param('user_id')
    .notEmpty()
    .withMessage('User ID is required')
    .isString()
    .withMessage('User ID must be a string'),
]

module.exports = {
  createTransactionValidator,
  getTransactionsValidator,
  getBalanceValidator,
}
