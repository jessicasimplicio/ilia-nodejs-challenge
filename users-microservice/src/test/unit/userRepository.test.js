const User = require('../../models/User')
const userRepository = require('../../repositories/userRepository')

jest.mock('../../models/User')

describe('UserRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      const mockUser = {
        _id: '123',
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
      }

      User.findOne.mockResolvedValue(mockUser)

      const result = await userRepository.findByEmail('test@example.com')

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' })
      expect(result).toEqual(mockUser)
    })

    it('should return null when user not found', async () => {
      User.findOne.mockResolvedValue(null)

      const result = await userRepository.findByEmail('nonexistent@example.com')

      expect(result).toBeNull()
    })
  })

  describe('findById', () => {
    it('should find user by id without password', async () => {
      const mockUser = {
        _id: '123',
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
      }

      const mockQuery = {
        select: jest.fn().mockResolvedValue(mockUser),
      }

      User.findOne.mockReturnValue(mockQuery)

      const result = await userRepository.findById('123')

      expect(User.findOne).toHaveBeenCalledWith({ _id: '123' })
      expect(mockQuery.select).toHaveBeenCalledWith('-password')
      expect(result).toEqual(mockUser)
    })
  })

  describe('create', () => {
    it('should create a new user', async () => {
      const userData = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'test@example.com',
        password: 'hashedpassword',
      }

      const mockUser = { ...userData, _id: '123' }
      User.create.mockResolvedValue(mockUser)

      const result = await userRepository.create(userData)

      expect(User.create).toHaveBeenCalledWith(userData)
      expect(result).toEqual(mockUser)
    })
  })

  describe('update', () => {
    it('should update user and return updated data', async () => {
      const updateData = {
        first_name: 'Jane',
        last_name: 'Smith',
      }

      const mockUpdatedUser = {
        _id: '123',
        ...updateData,
        email: 'test@example.com',
      }

      const mockQuery = {
        select: jest.fn().mockResolvedValue(mockUpdatedUser),
      }

      User.findByIdAndUpdate.mockReturnValue(mockQuery)

      const result = await userRepository.update('123', updateData)

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith('123', updateData, {
        new: true,
        runValidators: true,
      })
      expect(mockQuery.select).toHaveBeenCalledWith('-password')
      expect(result).toEqual(mockUpdatedUser)
    })
  })

  describe('emailExists', () => {
    it('should return true if email exists', async () => {
      const mockUser = { _id: '123', email: 'test@example.com' }
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(mockUser)

      const result = await userRepository.emailExists('test@example.com')

      expect(result).toBe(true)
    })

    it('should return false if email does not exist', async () => {
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null)

      const result = await userRepository.emailExists('nonexistent@example.com')

      expect(result).toBe(false)
    })
  })
})
