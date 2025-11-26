const transactionService = require('../../services/transactionService')
const transactionRepository = require('../../repositories/transactionRepository')

jest.mock('../../repositories/transactionRepository')

describe('TransactionService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createTransaction', () => {
    const validTransactionData = {
      user_id: 'user123',
      amount: 1000,
      type: 'CREDIT',
    }

    it('should create a transaction successfully', async () => {
      const mockTransaction = {
        _id: 'transaction123',
        ...validTransactionData,
        createdAt: new Date(),
      }

      transactionRepository.create.mockResolvedValue(mockTransaction)

      const result =
        await transactionService.createTransaction(validTransactionData)

      expect(transactionRepository.create).toHaveBeenCalledWith({
        user_id: 'user123',
        amount: 1000,
        type: 'CREDIT',
      })
      expect(result).toEqual({
        id: 'transaction123',
        user_id: 'user123',
        amount: 1000,
        type: 'CREDIT',
      })
    })

    it('should convert type to uppercase', async () => {
      const mockTransaction = {
        _id: 'transaction123',
        user_id: 'user123',
        amount: 1000,
        type: 'CREDIT',
      }

      transactionRepository.create.mockResolvedValue(mockTransaction)

      const result = await transactionService.createTransaction({
        ...validTransactionData,
        type: 'credit',
      })

      expect(transactionRepository.create).toHaveBeenCalledWith({
        user_id: 'user123',
        amount: 1000,
        type: 'CREDIT',
      })
      expect(result.type).toBe('CREDIT')
    })

    it('should accept both CREDIT and DEBIT types', async () => {
      const mockTransaction = {
        _id: 'transaction123',
        user_id: 'user123',
        amount: 1000,
        type: 'DEBIT',
      }

      transactionRepository.create.mockResolvedValue(mockTransaction)

      const result = await transactionService.createTransaction({
        ...validTransactionData,
        type: 'debit',
      })

      expect(result.type).toBe('DEBIT')
    })
  })

  describe('getTransactions', () => {
    it('should get all transactions when no type is provided', async () => {
      const mockTransactions = [
        {
          _id: 'trans1',
          user_id: 'user123',
          amount: 1000,
          type: 'CREDIT',
          createdAt: new Date('2023-01-01'),
        },
        {
          _id: 'trans2',
          user_id: 'user456',
          amount: 500,
          type: 'DEBIT',
          createdAt: new Date('2023-01-02'),
        },
      ]

      transactionRepository.findByType.mockResolvedValue(mockTransactions)

      const result = await transactionService.getTransactions()

      expect(transactionRepository.findByType).toHaveBeenCalledWith(null)
      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({
        id: 'trans1',
        user_id: 'user123',
        amount: 1000,
        type: 'CREDIT',
      })
    })

    it('should filter transactions by type', async () => {
      const mockTransactions = [
        {
          _id: 'trans1',
          user_id: 'user123',
          amount: 1000,
          type: 'CREDIT',
          createdAt: new Date('2023-01-01'),
        },
      ]

      transactionRepository.findByType.mockResolvedValue(mockTransactions)

      const result = await transactionService.getTransactions('CREDIT')

      expect(transactionRepository.findByType).toHaveBeenCalledWith('CREDIT')
      expect(result).toHaveLength(1)
      expect(result[0].type).toBe('CREDIT')
    })
  })

  describe('getBalanceByUserId', () => {
    it('should get balance for user', async () => {
      transactionRepository.getNetBalanceByUserId.mockResolvedValue(1500)

      const result = await transactionService.getBalanceByUserId('user123')

      expect(transactionRepository.getNetBalanceByUserId).toHaveBeenCalledWith(
        'user123'
      )
      expect(result).toEqual({
        user_id: 'user123',
        amount: 1500,
      })
    })

    it('should throw error when user_id is not provided', async () => {
      await expect(transactionService.getBalanceByUserId()).rejects.toThrow(
        'USER_ID_REQUIRED'
      )

      await expect(transactionService.getBalanceByUserId(null)).rejects.toThrow(
        'USER_ID_REQUIRED'
      )

      await expect(transactionService.getBalanceByUserId('')).rejects.toThrow(
        'USER_ID_REQUIRED'
      )
    })
  })

  describe('formatTransaction', () => {
    it('should format transaction correctly', () => {
      const mockTransaction = {
        _id: 'trans123',
        user_id: 'user123',
        amount: 1000,
        type: 'CREDIT',
        createdAt: new Date('2023-01-01'),
        extraField: 'should be excluded',
      }

      const result = transactionService.formatTransaction(mockTransaction)

      expect(result).toEqual({
        id: 'trans123',
        user_id: 'user123',
        amount: 1000,
        type: 'CREDIT',
      })
      expect(result.extraField).toBeUndefined()
    })
  })
})
