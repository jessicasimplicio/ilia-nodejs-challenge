const transactionRepository = require('../repositories/transactionRepository')

class TransactionService {
  async createTransaction(transactionData) {
    const { user_id, amount, type } = transactionData

    const transaction = await transactionRepository.create({
      user_id,
      amount,
      type: type.toUpperCase(),
    })

    return this.formatTransaction(transaction)
  }

  async getTransactions(type = null) {
    const transactions = await transactionRepository.findByType(type)
    return transactions.map(transaction => this.formatTransaction(transaction))
  }

  async getBalanceByUserId(userId) {
    if (!userId) {
      throw new Error('USER_ID_REQUIRED')
    }

    const balance = await transactionRepository.getNetBalanceByUserId(userId)
    
    return {
      user_id: userId,
      amount: balance
    }
  }

  formatTransaction(transaction) {
    return {
      id: transaction._id.toString(),
      user_id: transaction.user_id,
      amount: transaction.amount,
      type: transaction.type,
    }
  }
}

module.exports = new TransactionService()