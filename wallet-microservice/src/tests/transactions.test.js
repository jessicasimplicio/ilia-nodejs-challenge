const Transaction = require('../models/Transaction')
const {
  createTransaction,
  getTransactions,
  getBalance,
} = require('../controllers/transactions')

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
    const mockTransaction = { _id: '1', ...req.body }
    Transaction.create.mockResolvedValue(mockTransaction)

    await createTransaction(req, res)

    expect(Transaction.create).toHaveBeenCalledWith(req.body)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({
      response: mockTransaction,
      message: 'Transaction created',
    })
  })

  it('should handle database error when creating transaction', async () => {
    req.body = { user_id: '123', amount: 100, type: 'CREDIT' }
    const mockError = new Error('DB error')
    Transaction.create.mockRejectedValue(mockError)

    await createTransaction(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error when saving',
      err: mockError,
    })
  })

  it('should get all transactions successfully', async () => {
    const mockTransactions = [{ _id: '1', amount: 100, type: 'CREDIT' }]
    Transaction.find.mockResolvedValue(mockTransactions)

    await getTransactions(req, res)

    expect(Transaction.find).toHaveBeenCalledWith({})
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      result: mockTransactions,
      message: 'Transactions found',
    })
  })

  it('should get transactions filtered by valid type', async () => {
    req.query.type = 'CREDIT'
    const mockTransactions = [{ _id: '1', amount: 100, type: 'CREDIT' }]
    Transaction.find.mockResolvedValue(mockTransactions)

    await getTransactions(req, res)

    expect(Transaction.find).toHaveBeenCalledWith({ type: 'CREDIT' })
    expect(res.status).toHaveBeenCalledWith(200)
  })

  it('should return error for invalid type filter', async () => {
    req.query.type = 'INVALID'

    await getTransactions(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid type query: must be 'CREDIT' or 'DEBIT'",
    })
    expect(Transaction.find).not.toHaveBeenCalled()
  })

  it('should handle database error when getting transactions', async () => {
    const mockError = new Error('DB error')
    Transaction.find.mockRejectedValue(mockError)

    await getTransactions(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      message: 'Erro when fiding transaction',
      err: mockError,
    })
  })

  it('should get balance successfully with positive balance', async () => {
    req.params.user_id = '123'
    const mockResult = [{ netBalance: 150 }]
    Transaction.aggregate.mockResolvedValue(mockResult)

    await getBalance(req, res)

    expect(Transaction.aggregate).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ amount: 150 })
  })

  it('should return zero balance when no transactions found', async () => {
    req.params.user_id = '123'
    Transaction.aggregate.mockResolvedValue([])

    await getBalance(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ amount: 0 })
  })

  it('should return error when user_id is missing in getBalance', async () => {
    req.params.user_id = ''

    await getBalance(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      message: 'Missing user_id param',
    })
    expect(Transaction.aggregate).not.toHaveBeenCalled()
  })

  it('should handle database error when getting balance', async () => {
    req.params.user_id = '123'
    const mockError = new Error('DB error')
    Transaction.aggregate.mockRejectedValue(mockError)

    await getBalance(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      message: 'Erro when fiding transaction',
      err: mockError,
    })
  })
})
