const axios = require('axios')
const jwt = require('jsonwebtoken')
const walletService = require('../../services/walletServices')

jest.mock('axios')
jest.mock('jsonwebtoken')

describe('WalletService', () => {
  beforeEach(() => {
    process.env.JWT_INTERNAL_SECRET = 'test-internal-secret'
    jest.clearAllMocks()
  })

  it('should generate internal token successfully', () => {
    const mockToken = 'mock-internal-token'
    jwt.sign.mockReturnValue(mockToken)

    const result = walletService.generateInternalToken()

    expect(jwt.sign).toHaveBeenCalledWith(
      { service: 'users-microservice', internal: true },
      'test-internal-secret',
      { expiresIn: '5h' }
    )
    expect(result).toBe(mockToken)
  })

  it('should create first transaction successfully', async () => {
    const userId = '123'
    const mockToken = 'mock-token'
    const mockResponse = { data: { message: 'Transaction created' } }

    jwt.sign.mockReturnValue(mockToken)
    axios.post.mockResolvedValue(mockResponse)

    const result = await walletService.createFirstTransaction(userId)

    expect(jwt.sign).toHaveBeenCalled()
    expect(axios.post).toHaveBeenCalledWith(
      'http://wallet-service:3001/api/transactions',
      {
        user_id: userId,
        type: 'CREDIT',
        amount: 0,
      },
      {
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
      }
    )
    expect(result).toEqual(mockResponse.data)
  })

  it('should handle axios network error', async () => {
    const userId = '123'
    const mockToken = 'mock-token'
    const networkError = new Error('Network error')

    jwt.sign.mockReturnValue(mockToken)
    axios.post.mockRejectedValue(networkError)

    await expect(walletService.createFirstTransaction(userId)).rejects.toThrow(
      'Network error'
    )

    expect(axios.post).toHaveBeenCalled()
  })

  it('should handle axios response error', async () => {
    const userId = '123'
    const mockToken = 'mock-token'
    const responseError = {
      response: {
        status: 500,
        data: { error: 'Internal server error' },
      },
    }

    jwt.sign.mockReturnValue(mockToken)
    axios.post.mockRejectedValue(responseError)

    await expect(walletService.createFirstTransaction(userId)).rejects.toEqual(
      responseError
    )
  })

  it('should handle JWT signing error', async () => {
    const userId = '123'
    const jwtError = new Error('JWT signing failed')

    jwt.sign.mockImplementation(() => {
      throw jwtError
    })

    await expect(walletService.createFirstTransaction(userId)).rejects.toThrow(
      'JWT signing failed'
    )

    expect(axios.post).not.toHaveBeenCalled()
  })

  it('should handle empty user ID', async () => {
    const userId = ''
    const mockToken = 'mock-token'
    const mockResponse = { data: { message: 'Transaction created' } }

    jwt.sign.mockReturnValue(mockToken)
    axios.post.mockResolvedValue(mockResponse)

    const result = await walletService.createFirstTransaction(userId)

    expect(axios.post).toHaveBeenCalledWith(
      expect.any(String),
      {
        user_id: '',
        type: 'CREDIT',
        amount: 0,
      },
      expect.any(Object)
    )
    expect(result).toEqual(mockResponse.data)
  })

  it('should handle undefined user ID', async () => {
    const mockToken = 'mock-token'
    const mockResponse = { data: { message: 'Transaction created' } }

    jwt.sign.mockReturnValue(mockToken)
    axios.post.mockResolvedValue(mockResponse)

    const result = await walletService.createFirstTransaction(undefined)

    expect(axios.post).toHaveBeenCalledWith(
      expect.any(String),
      {
        user_id: undefined,
        type: 'CREDIT',
        amount: 0,
      },
      expect.any(Object)
    )
    expect(result).toEqual(mockResponse.data)
  })

  it('should send correct payload structure for transaction', async () => {
    const userId = 'user-123'
    const mockToken = 'mock-token'
    const mockResponse = { data: { success: true } }

    jwt.sign.mockReturnValue(mockToken)
    axios.post.mockResolvedValue(mockResponse)

    await walletService.createFirstTransaction(userId)

    const expectedPayload = {
      user_id: 'user-123',
      type: 'CREDIT',
      amount: 0,
    }

    expect(axios.post).toHaveBeenCalledWith(
      'http://wallet-service:3001/api/transactions',
      expectedPayload,
      expect.objectContaining({
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
      })
    )
  })
})
