const Transaction = require('../models/Transaction')
const {
  SUCCESS_MESSAGES,
  HTTP_STATUS,
  ERROR_MESSAGES,
} = require('../utils/constants/httpStatus')
const responseHandler = require('../utils/responseHandler')

const createTransaction = async (req, res) => {
  try {
    const { user_id, amount, type } = req.body
    const transaction = {
      user_id,
      amount,
      type: type.toUpperCase(),
    }

    const response = await Transaction.create(transaction)
    const formattedResponse = {
      user_id: response.user_id,
      amount: response.amount,
      type: response.type,
    }

    responseHandler.success(
      res,
      formattedResponse,
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

    const filter = type ? { type } : {}
    const result = await Transaction.find(filter)

    const formattedResult = result.map((transaction) => ({
      id: transaction._id.toString(),
      user_id: transaction.user_id,
      amount: transaction.amount,
      type: transaction.type,
    }))

    responseHandler.success(
      res,
      { transactions: formattedResult },
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

    const result = await Transaction.aggregate([
      {
        $match: {
          user_id,
        },
      },
      {
        $group: {
          _id: null,
          netBalance: {
            $sum: {
              $cond: [
                { $eq: ['$type', 'CREDIT'] },
                '$amount',
                { $multiply: ['$amount', -1] },
              ],
            },
          },
        },
      },
    ])

    const amount = result?.[0]?.netBalance ?? 0

    responseHandler.success(
      res,
      {
        amount,
      },
      SUCCESS_MESSAGES.BALANCE_CALCULATED
    )
  } catch (err) {
    responseHandler.error(
      res,
      ERROR_MESSAGES.BALANCE_FETCH_FAILED,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    )
  }
}

module.exports = { createTransaction, getTransactions, getBalance }
