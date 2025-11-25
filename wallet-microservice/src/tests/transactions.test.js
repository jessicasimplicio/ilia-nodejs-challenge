const Transaction = require('../models/Transaction')
const {
  createTransaction,
  getTransactions,
  getBalance,
} = require('../controllers/transactions')
const {
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} = require('../utils/constants/httpStatus')
const { success } = require('../utils/responseHandler')

jest.mock('../models/Transaction')

describe('Transactions Controller', () => {
  let req, res

  beforeEach(() => {
    req = { body: {}, query: {}, params: {} }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    jest.clearAllMocks()
  })

  it('should create transaction successfully', async () => {
    req.body = { user_id: '123', amount: 100, type: 'CREDIT' }
    const mockTransaction = {
      _id: '1',
      user_id: '123',
      amount: 100,
      type: 'CREDIT',
      createdAt: '2023-01-01T00:00:00.000Z',
    }

    Transaction.create.mockResolvedValue(mockTransaction)

    await createTransaction(req, res)

    expect(Transaction.create).toHaveBeenCalledWith({
      user_id: '123',
      amount: 100,
      type: 'CREDIT',
    })
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED)
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: {
        user_id: '123',
        amount: 100,
        type: 'CREDIT',
      },
      message: SUCCESS_MESSAGES.TRANSACTION_CREATED,
    })
  })

  it('should handle database error when creating transaction', async () => {
    req.body = { user_id: '123', amount: 100, type: 'CREDIT' }
    const mockError = new Error('DB error')
    Transaction.create.mockRejectedValue(mockError)

    await createTransaction(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      error: ERROR_MESSAGES.TRANSACTION_CREATION_FAILED,
      success: false,
    })
  })

  it('should get all transactions successfully', async () => {
    const mockTransactions = [
      { _id: '1', amount: 100, type: 'CREDIT', user_id: '123' },
    ]
    Transaction.find.mockResolvedValue(mockTransactions)

    await getTransactions(req, res)

    expect(Transaction.find).toHaveBeenCalledWith({})
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK)
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: {
        transactions: [
          {
            id: '1',
            user_id: '123',
            amount: 100,
            type: 'CREDIT',
          },
        ],
      },
      message: SUCCESS_MESSAGES.TRANSACTIONS_FOUND,
    })
  })

  it('should get transactions filtered by valid type', async () => {
    req.query.type = 'CREDIT'
    const mockTransactions = [{ _id: '1', amount: 100, type: 'CREDIT' }]
    Transaction.find.mockResolvedValue(mockTransactions)

    await getTransactions(req, res)

    expect(Transaction.find).toHaveBeenCalledWith({ type: 'CREDIT' })
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK)
  })

  it('should return error for invalid type filter', async () => {
    req.query.type = 'INVALID'

    await getTransactions(req, res)

    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: ERROR_MESSAGES.INVALID_TRANSACTION_TYPE,
    })
    expect(Transaction.find).not.toHaveBeenCalled()
  })

  it('should handle database error when getting transactions', async () => {
    const mockError = new Error('DB error')
    Transaction.find.mockRejectedValue(mockError)

    await getTransactions(req, res)

    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: ERROR_MESSAGES.TRANSACTION_FETCH_FAILED,
    })
  })

  it('should get balance successfully with positive balance', async () => {
    req.params.user_id = '123'
    const mockResult = [{ netBalance: 150 }]
    Transaction.aggregate.mockResolvedValue(mockResult)

    await getBalance(req, res)

    expect(Transaction.aggregate).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK)
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: {
        amount: 150,
      },
      message: SUCCESS_MESSAGES.BALANCE_CALCULATED,
    })
  })

  it('should get balance successfully with negative balance', async () => {
    req.params.user_id = '123'
    const mockResult = [{ netBalance: -50 }]
    Transaction.aggregate.mockResolvedValue(mockResult)

    await getBalance(req, res)

    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK)
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: {
        amount: -50,
      },
      message: SUCCESS_MESSAGES.BALANCE_CALCULATED,
    })
  })

  it('should return zero balance when no transactions found', async () => {
    req.params.user_id = '123'
    Transaction.aggregate.mockResolvedValue([])

    await getBalance(req, res)

    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK)
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: {
        amount: 0,
      },
      message: SUCCESS_MESSAGES.BALANCE_CALCULATED,
    })
  })

  it('should return error when user_id is missing in getBalance', async () => {
    req.params.user_id = ''

    await getBalance(req, res)

    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: ERROR_MESSAGES.MISSING_USER_ID,
    })
    expect(Transaction.aggregate).not.toHaveBeenCalled()
  })

  it('should handle database error when getting balance', async () => {
    req.params.user_id = '123'
    const mockError = new Error('DB error')
    Transaction.aggregate.mockRejectedValue(mockError)

    await getBalance(req, res)

    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: ERROR_MESSAGES.BALANCE_FETCH_FAILED,
    })
  })
})
