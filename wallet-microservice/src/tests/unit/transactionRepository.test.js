const Transaction = require('../../models/Transaction')
const transactionRepository = require('../../repositories/transactionRepository')

jest.mock('../../models/Transaction')

describe('TransactionRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should create a new transaction', async () => {
      const transactionData = {
        user_id: 'user123',
        amount: 1000,
        type: 'CREDIT',
      }

      const mockTransaction = {
        _id: 'transaction123',
        ...transactionData,
        createdAt: new Date(),
      }

      Transaction.create.mockResolvedValue(mockTransaction)

      const result = await transactionRepository.create(transactionData)

      expect(Transaction.create).toHaveBeenCalledWith(transactionData)
      expect(result).toEqual(mockTransaction)
    })
  })

  describe('findByType', () => {
    it('should find transactions by type', async () => {
      const mockTransactions = [
        {
          _id: 'trans1',
          user_id: 'user123',
          amount: 1000,
          type: 'CREDIT',
        },
        {
          _id: 'trans2',
          user_id: 'user456',
          amount: 500,
          type: 'CREDIT',
        },
      ]

      Transaction.find.mockResolvedValue(mockTransactions)

      const result = await transactionRepository.findByType('CREDIT')

      expect(Transaction.find).toHaveBeenCalledWith({ type: 'CREDIT' })
      expect(result).toEqual(mockTransactions)
    })

    it('should find all transactions when no type is provided', async () => {
      const mockTransactions = [
        {
          _id: 'trans1',
          user_id: 'user123',
          amount: 1000,
          type: 'CREDIT',
        },
        {
          _id: 'trans2',
          user_id: 'user456',
          amount: 500,
          type: 'DEBIT',
        },
      ]

      Transaction.find.mockResolvedValue(mockTransactions)

      const result = await transactionRepository.findByType()

      expect(Transaction.find).toHaveBeenCalledWith({})
      expect(result).toEqual(mockTransactions)
    })
  })

  describe('getNetBalanceByUserId', () => {
    it('should calculate net balance correctly', async () => {
      const mockAggregateResult = [
        {
          _id: null,
          netBalance: 500,
        },
      ]

      Transaction.aggregate.mockResolvedValue(mockAggregateResult)

      const result =
        await transactionRepository.getNetBalanceByUserId('user123')

      expect(Transaction.aggregate).toHaveBeenCalledWith([
        {
          $match: {
            user_id: 'user123',
          },
        },
        {
          $group: {
            _id: null,
            netBalance: {
              $sum: {
                $cond: [
                  { $eq: ['$type', 'CREDIT'] },
                  '$amount',
                  { $multiply: ['$amount', -1] },
                ],
              },
            },
          },
        },
      ])
      expect(result).toBe(500)
    })

    it('should return 0 when no transactions found', async () => {
      Transaction.aggregate.mockResolvedValue([])

      const result =
        await transactionRepository.getNetBalanceByUserId('user123')

      expect(result).toBe(0)
    })

    it('should return 0 when netBalance is undefined', async () => {
      Transaction.aggregate.mockResolvedValue([{}])

      const result =
        await transactionRepository.getNetBalanceByUserId('user123')

      expect(result).toBe(0)
    })
  })
})
