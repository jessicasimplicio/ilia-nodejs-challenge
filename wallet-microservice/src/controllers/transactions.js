const transactionService = require('../services/transactionService')
const {
  SUCCESS_MESSAGES,
  HTTP_STATUS,
  ERROR_MESSAGES,
} = require('../utils/constants/httpStatus')
const responseHandler = require('../utils/responseHandler')

const createTransaction = async (req, res) => {
  try {
    const { user_id, amount, type } = req.body

    const transaction = await transactionService.createTransaction({
      user_id,
      amount,
      type,
    })

    responseHandler.success(
      res,
      transaction,
      SUCCESS_MESSAGES.TRANSACTION_CREATED,
      HTTP_STATUS.CREATED
    )
  } catch (err) {
    responseHandler.error(
      res,
      ERROR_MESSAGES.TRANSACTION_CREATION_FAILED,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    )
  }
}

const getTransactions = async (req, res) => {
  try {
    const type = req.query.type

    const transactions = await transactionService.getTransactions(type)

    responseHandler.success(
      res,
      { transactions },
      SUCCESS_MESSAGES.TRANSACTIONS_FOUND
    )
  } catch (err) {
    responseHandler.error(
      res,
      ERROR_MESSAGES.TRANSACTION_FETCH_FAILED,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    )
  }
}

const getBalance = async (req, res) => {
  try {
    const user_id = req.params.user_id

    const balance = await transactionService.getBalanceByUserId(user_id)

    responseHandler.success(res, balance, SUCCESS_MESSAGES.BALANCE_CALCULATED)
  } catch (err) {
    responseHandler.error(
      res,
      ERROR_MESSAGES.BALANCE_FETCH_FAILED,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    )
  }
}

module.exports = {
  createTransaction,
  getTransactions,
  getBalance,
}
