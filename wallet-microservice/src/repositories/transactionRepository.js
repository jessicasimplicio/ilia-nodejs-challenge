const Transaction = require('../models/Transaction')

class TransactionRepository {
  async create(transactionData) {
    return await Transaction.create(transactionData)
  }

  async findByType(type) {
    const filter = type ? { type } : {}
    return await Transaction.find(filter)
  }

  async getNetBalanceByUserId(userId) {
    const result = await Transaction.aggregate([
      {
        $match: {
          user_id: userId,
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

    return result?.[0]?.netBalance ?? 0
  }
}

module.exports = new TransactionRepository()
