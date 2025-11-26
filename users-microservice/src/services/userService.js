const userRepository = require('../repositories/userRepository')
const bcrypt = require('bcrypt')
const walletService = require('./walletServices')

class UserService {
  async registerUser(userData) {
    const { email, password, first_name, last_name } = userData

    if (await userRepository.emailExists(email)) {
      throw new Error('USER_ALREADY_EXISTS')
    }

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    const user = await userRepository.create({
      first_name,
      last_name,
      password: hashPassword,
      email,
    })

    try {
      await walletService.createFirstTransaction(user._id.toString())
    } catch (err) {
      console.log('Wallet initialization failed:', err.message)
    }

    return this.formatUserResponse(user)
  }

  async loginUser(email, password) {
    const user = await userRepository.findByEmail(email)
    if (!user) {
      throw new Error('INVALID_CREDENTIALS')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      throw new Error('INVALID_CREDENTIALS')
    }

    return this.formatUserResponse(user)
  }

  async getUserById(id) {
    const user = await userRepository.findById(id)
    if (!user) {
      throw new Error('USER_NOT_FOUND')
    }
    return this.formatUserResponse(user)
  }

  async updateUser(id, updateData) {
    const user = await userRepository.update(id, updateData)
    if (!user) {
      throw new Error('USER_NOT_FOUND')
    }
    return this.formatUserResponse(user)
  }

  async deleteUser(id) {
    const result = await userRepository.delete(id)
    if (!result) {
      throw new Error('USER_NOT_FOUND')
    }
    return true
  }

  async getAllUsers() {
    const users = await userRepository.findAll()
    return users.map((user) => this.formatUserResponse(user))
  }

  formatUserResponse(user) {
    return {
      id: user._id.toString(),
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    }
  }
}

module.exports = new UserService()
