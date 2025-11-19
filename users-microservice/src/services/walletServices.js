const axios = require('axios')
const jwt = require('jsonwebtoken')

class WalletService {
  generateInternalToken() {
    return jwt.sign(
      { service: 'users-microservice', internal: true },
      process.env.JWT_INTERNAL_SECRET,
      { expiresIn: '5h' }
    )
  }

  async createFirstTransaction(userId) {
    const token = this.generateInternalToken()

    const response = await axios.post(
      'http://wallet-service:3001/api/transactions',
      {
        user_id: userId,
        type: 'CREDIT',
        amount: 0,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    return response.data
  }
}

module.exports = new WalletService()
