const userService = require('../../services/userService')
const userRepository = require('../../repositories/userRepository')
const walletService = require('../../services/walletServices')
const bcrypt = require('bcrypt')

jest.mock('../../repositories/userRepository')
jest.mock('../../services/walletServices')
jest.mock('bcrypt')

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('registerUser', () => {
    const userData = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'test@example.com',
      password: 'plainpassword',
    }

    it('should register a new user successfully', async () => {
      userRepository.emailExists.mockResolvedValue(false)
      bcrypt.genSalt.mockResolvedValue('salt')
      bcrypt.hash.mockResolvedValue('hashedpassword')

      const mockUser = {
        _id: '123',
        ...userData,
        password: 'hashedpassword',
      }
      userRepository.create.mockResolvedValue(mockUser)
      walletService.createFirstTransaction.mockResolvedValue(true)

      const result = await userService.registerUser(userData)

      expect(userRepository.emailExists).toHaveBeenCalledWith(
        'test@example.com'
      )
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10)
      expect(bcrypt.hash).toHaveBeenCalledWith('plainpassword', 'salt')
      expect(userRepository.create).toHaveBeenCalledWith({
        first_name: 'John',
        last_name: 'Doe',
        email: 'test@example.com',
        password: 'hashedpassword',
      })
      expect(walletService.createFirstTransaction).toHaveBeenCalledWith('123')
      expect(result).toEqual({
        id: '123',
        first_name: 'John',
        last_name: 'Doe',
        email: 'test@example.com',
      })
    })

    it('should throw error when email already exists', async () => {
      userRepository.emailExists.mockResolvedValue(true)

      await expect(userService.registerUser(userData)).rejects.toThrow(
        'USER_ALREADY_EXISTS'
      )
    })

    it('should handle wallet initialization failure gracefully', async () => {
      userRepository.emailExists.mockResolvedValue(false)
      bcrypt.genSalt.mockResolvedValue('salt')
      bcrypt.hash.mockResolvedValue('hashedpassword')

      const mockUser = {
        _id: '123',
        ...userData,
        password: 'hashedpassword',
      }
      userRepository.create.mockResolvedValue(mockUser)
      walletService.createFirstTransaction.mockRejectedValue(
        new Error('Wallet error')
      )

      const result = await userService.registerUser(userData)

      expect(result).toBeDefined()
      expect(walletService.createFirstTransaction).toHaveBeenCalled()
    })
  })

  describe('loginUser', () => {
    const credentials = {
      email: 'test@example.com',
      password: 'correctpassword',
    }

    it('should login user successfully', async () => {
      const mockUser = {
        _id: '123',
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        password: 'hashedpassword',
      }

      userRepository.findByEmail.mockResolvedValue(mockUser)
      bcrypt.compare.mockResolvedValue(true)

      const result = await userService.loginUser(
        credentials.email,
        credentials.password
      )

      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        'test@example.com'
      )
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'correctpassword',
        'hashedpassword'
      )
      expect(result).toEqual({
        id: '123',
        first_name: 'John',
        last_name: 'Doe',
        email: 'test@example.com',
      })
    })

    it('should throw error when user not found', async () => {
      userRepository.findByEmail.mockResolvedValue(null)

      // Act & Assert
      await expect(
        userService.loginUser(credentials.email, credentials.password)
      ).rejects.toThrow('INVALID_CREDENTIALS')
    })

    it('should throw error when password is incorrect', async () => {
      const mockUser = {
        _id: '123',
        email: 'test@example.com',
        password: 'hashedpassword',
      }

      userRepository.findByEmail.mockResolvedValue(mockUser)
      bcrypt.compare.mockResolvedValue(false)

      // Act & Assert
      await expect(
        userService.loginUser(credentials.email, credentials.password)
      ).rejects.toThrow('INVALID_CREDENTIALS')
    })
  })

  describe('getUserById', () => {
    it('should return user when found', async () => {
      const mockUser = {
        _id: '123',
        first_name: 'John',
        last_name: 'Doe',
        email: 'test@example.com',
      }

      userRepository.findById.mockResolvedValue(mockUser)

      const result = await userService.getUserById('123')

      expect(userRepository.findById).toHaveBeenCalledWith('123')
      expect(result).toEqual({
        id: '123',
        first_name: 'John',
        last_name: 'Doe',
        email: 'test@example.com',
      })
    })

    it('should throw error when user not found', async () => {
      userRepository.findById.mockResolvedValue(null)

      // Act & Assert
      await expect(userService.getUserById('123')).rejects.toThrow(
        'USER_NOT_FOUND'
      )
    })
  })

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const updateData = {
        first_name: 'Jane',
        last_name: 'Smith',
      }

      const mockUpdatedUser = {
        _id: '123',
        ...updateData,
        email: 'test@example.com',
      }

      userRepository.update.mockResolvedValue(mockUpdatedUser)

      const result = await userService.updateUser('123', updateData)

      expect(userRepository.update).toHaveBeenCalledWith('123', updateData)
      expect(result).toEqual({
        id: '123',
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'test@example.com',
      })
    })
  })
})
