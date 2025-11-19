const Transaction = require('../models/Transaction')

const createTransaction = async (req, res) => {
  try {
    const { user_id, amount, type } = req.body

    const transaction = {
      user_id,
      amount,
      type,
    }

    const response = await Transaction.create(transaction)
    res.status(201).json({ response, message: 'Transaction created' })
  } catch (err) {
    res.status(500).json({ message: 'Error when saving', err })
  }
}

const getTransactions = async (req, res) => {
  try {
    const type = req.query.type

    if (type && !['CREDIT', 'DEBIT'].includes(type)) {
      return res
        .status(400)
        .json({ message: "Invalid type query: must be 'CREDIT' or 'DEBIT'" })
    }

    const filter = type ? { type } : {}
    const result = await Transaction.find(filter)

    res.status(200).json({ result, message: 'Transactions found' })
  } catch (err) {
    res.status(500).json({ message: 'Erro when fiding transaction', err })
  }
}

const getBalance = async (req, res) => {
  try {
    const user_id = req.params.user_id
    if (!user_id) {
      return res.status(400).json({ message: 'Missing user_id param' })
    }

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
                { $eq: ['$type', 'credit'] },
                '$amount',
                { $multiply: ['$amount', -1] },
              ],
            },
          },
        },
      },
    ])

    const amount = result?.[0]?.netBalance ?? 0

    res.status(200).json({ amount })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Erro when fiding transaction', err })
  }
}

module.exports = { createTransaction, getTransactions, getBalance }
