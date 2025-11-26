const User = require('../models/User')

class UserRepository {
  async findByEmail(email) {
    return await User.findOne({ email })
  }

  async findById(id) {
    return await User.findOne({ _id: id }).select('-password')
  }

  async findAll() {
    return await User.find().select('-password -__v')
  }

  async create(userData) {
    return await User.create(userData)
  }

  async update(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select('-password')
  }

  async delete(id) {
    return await User.findByIdAndDelete(id)
  }

  async emailExists(email) {
    const user = await this.findByEmail(email)
    return user !== null
  }
}

module.exports = new UserRepository()
