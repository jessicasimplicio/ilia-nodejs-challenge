const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const walletService = require('../services/walletServices')
const {
  registerUser,
  loginUser,
  findUsers,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/users')

jest.mock('../models/User')
jest.mock('jsonwebtoken')
jest.mock('bcrypt')
jest.mock('../services/walletServices')

describe('Users Controller', () => {
  let req, res

  beforeEach(() => {
    req = { body: {}, params: {} }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    process.env.JWT_SECRET = 'test-secret'
    jest.clearAllMocks()
  })

  it('should register user successfully', async () => {
    req.body.user = {
      first_name: 'John',
      last_name: 'Doe',
      password: 'password123',
      email: 'john@example.com',
    }

    const mockUser = {
      _id: '123',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
    }

    bcrypt.genSalt.mockResolvedValue('salt')
    bcrypt.hash.mockResolvedValue('hashedPassword')
    User.create.mockResolvedValue(mockUser)
    walletService.createFirstTransaction.mockResolvedValue()

    await registerUser(req, res)

    expect(User.create).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({
      user: {
        id: '123',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
      },
    })
  })

  it('should register user even when wallet service fails', async () => {
    req.body.user = {
      first_name: 'John',
      last_name: 'Doe',
      password: 'password123',
      email: 'john@example.com',
    }

    const mockUser = { _id: '123', ...req.body.user }

    bcrypt.genSalt.mockResolvedValue('salt')
    bcrypt.hash.mockResolvedValue('hashedPassword')
    User.create.mockResolvedValue(mockUser)
    walletService.createFirstTransaction.mockRejectedValue(
      new Error('Wallet error')
    )

    await registerUser(req, res)

    expect(User.create).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(201)
  })

  it('should handle database error when registering user', async () => {
    req.body.user = {
      first_name: 'John',
      last_name: 'Doe',
      password: 'password123',
      email: 'john@example.com',
    }

    bcrypt.genSalt.mockResolvedValue('salt')
    bcrypt.hash.mockResolvedValue('hashedPassword')
    User.create.mockRejectedValue(new Error('DB error'))

    await registerUser(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
  })

  it('should login user successfully', async () => {
    req.body.user = {
      email: 'john@example.com',
      password: 'password123',
    }

    const mockUser = {
      _id: '123',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      password: 'hashedPassword',
    }

    User.findOne.mockResolvedValue(mockUser)
    bcrypt.compare.mockResolvedValue(true)
    jwt.sign.mockReturnValue('mock-token')

    await loginUser(req, res)

    expect(User.findOne).toHaveBeenCalledWith({ email: 'john@example.com' })
    expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword')
    expect(res.status).toHaveBeenCalledWith(200)
  })

  it('should return error when user does not exist', async () => {
    req.body.user = {
      email: 'nonexistent@example.com',
      password: 'password123',
    }

    User.findOne.mockResolvedValue(null)

    await loginUser(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: 'User doens`t exist' })
  })

  it('should return error when password is invalid', async () => {
    req.body.user = {
      email: 'john@example.com',
      password: 'wrongpassword',
    }

    const mockUser = {
      _id: '123',
      email: 'john@example.com',
      password: 'hashedPassword',
    }

    User.findOne.mockResolvedValue(mockUser)
    bcrypt.compare.mockResolvedValue(false)

    await loginUser(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid password' })
  })

  it('should get all users successfully', async () => {
    const mockUsers = [
      {
        _id: '1',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
      },
      {
        _id: '2',
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane@example.com',
      },
    ]

    User.find.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUsers),
    })

    await findUsers(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ users: mockUsers })
  })

  it('should get specific user successfully', async () => {
    req.params.id = '123'
    const mockUser = {
      _id: '123',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
    }

    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser),
    })

    await getUser(req, res)

    expect(User.findOne).toHaveBeenCalledWith({ _id: '123' })
    expect(res.status).toHaveBeenCalledWith(200)
  })

  it('should update user successfully', async () => {
    req.params.id = '123'
    req.body = {
      first_name: 'Johnny',
      last_name: 'Smith',
      email: 'johnny@example.com',
    }

    const mockUser = {
      _id: '123',
      first_name: 'Johnny',
      last_name: 'Smith',
      email: 'johnny@example.com',
    }

    User.findByIdAndUpdate.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser),
    })

    await updateUser(req, res)

    expect(User.findByIdAndUpdate).toHaveBeenCalledWith('123', req.body, {
      new: true,
      runValidators: true,
    })
    expect(res.status).toHaveBeenCalledWith(200)
  })

  it('should delete user successfully', async () => {
    req.params.id = '123'
    const mockUser = { _id: '123', first_name: 'John' }

    User.findByIdAndDelete.mockResolvedValue(mockUser)

    await deleteUser(req, res)

    expect(User.findByIdAndDelete).toHaveBeenCalledWith({ _id: '123' })
    expect(res.status).toHaveBeenCalledWith(204)
  })
})
