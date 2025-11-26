const { validationResult } = require('express-validator')
const {
  createTransactionValidator,
  getTransactionsValidator,
  getBalanceValidator,
  updateTransactionValidator,
  deleteTransactionValidator,
} = require('../utils/validators/transactionSchemas')

const createMockRequest = (body = {}, params = {}, query = {}) => ({
  body,
  params,
  query,
})

const testValidator = async (validators, req) => {
  for (const validator of validators) {
    await validator(req, {}, () => {})
  }

  return validationResult(req)
}

describe('Transaction Validators', () => {
  describe('createTransactionValidator', () => {
    it('should pass validation with correct data for CREDIT', async () => {
      const req = createMockRequest({
        user_id: 'user123',
        amount: 100.5,
        type: 'CREDIT',
      })

      const result = await testValidator(createTransactionValidator, req)

      expect(result.isEmpty()).toBe(true)
    })

    it('should pass validation with correct data for DEBIT', async () => {
      const req = createMockRequest({
        user_id: 'user123',
        amount: 50.25,
        type: 'DEBIT',
      })

      const result = await testValidator(createTransactionValidator, req)

      expect(result.isEmpty()).toBe(true)
    })

    it('should fail validation with missing user_id', async () => {
      const req = createMockRequest({
        amount: 100,
        type: 'CREDIT',
      })

      const result = await testValidator(createTransactionValidator, req)

      expect(result.isEmpty()).toBe(false)
      expect(result.array()[0].msg).toContain('User ID is required')
    })

    it('should fail validation with negative amount', async () => {
      const req = createMockRequest({
        user_id: 'user123',
        amount: -100,
        type: 'CREDIT',
      })

      const result = await testValidator(createTransactionValidator, req)

      expect(result.isEmpty()).toBe(false)
      expect(result.array()[0].msg).toContain(
        'Amount must be a positive number'
      )
    })

    it('should fail validation with zero amount', async () => {
      const req = createMockRequest({
        user_id: 'user123',
        amount: 0,
        type: 'CREDIT',
      })

      const result = await testValidator(createTransactionValidator, req)

      expect(result.isEmpty()).toBe(false)
      expect(result.array()[0].msg).toContain(
        'Amount must be a positive number'
      )
    })

    it('should fail validation with invalid type', async () => {
      const req = createMockRequest({
        user_id: 'user123',
        amount: 100,
        type: 'INVALID',
      })

      const result = await testValidator(createTransactionValidator, req)

      expect(result.isEmpty()).toBe(false)
      expect(result.array()[0].msg).toContain(
        "Type must be 'CREDIT' or 'DEBIT'"
      )
    })

    it('should fail validation with missing type', async () => {
      const req = createMockRequest({
        user_id: 'user123',
        amount: 100,
      })

      const result = await testValidator(createTransactionValidator, req)

      expect(result.isEmpty()).toBe(false)
      expect(result.array()[0].msg).toContain(
        "Type must be 'CREDIT' or 'DEBIT'"
      )
    })
  })

  describe('getTransactionsValidator', () => {
    it('should fail validation without type filter', async () => {
      const req = createMockRequest({}, {}, {})

      const result = await testValidator(getTransactionsValidator, req)

      expect(result.isEmpty()).toBe(false)
      expect(result.array()[0].msg).toContain(
        "Type must be 'CREDIT' or 'DEBIT'"
      )
    })

    it('should pass validation with valid CREDIT type filter', async () => {
      const req = createMockRequest(
        {},
        {},
        {
          type: 'CREDIT',
        }
      )

      const result = await testValidator(getTransactionsValidator, req)

      expect(result.isEmpty()).toBe(true)
    })

    it('should pass validation with valid DEBIT type filter', async () => {
      const req = createMockRequest(
        {},
        {},
        {
          type: 'DEBIT',
        }
      )

      const result = await testValidator(getTransactionsValidator, req)

      expect(result.isEmpty()).toBe(true)
    })

    it('should fail validation with invalid type filter', async () => {
      const req = createMockRequest(
        {},
        {},
        {
          type: 'INVALID',
        }
      )

      const result = await testValidator(getTransactionsValidator, req)

      expect(result.isEmpty()).toBe(false)
      expect(result.array()[0].msg).toContain(
        "Type must be 'CREDIT' or 'DEBIT'"
      )
    })
  })

  describe('getBalanceValidator', () => {
    it('should pass validation with valid user_id', async () => {
      const req = createMockRequest(
        {},
        {
          user_id: 'user123',
        }
      )

      const result = await testValidator(getBalanceValidator, req)

      expect(result.isEmpty()).toBe(true)
    })

    it('should fail validation with missing user_id', async () => {
      const req = createMockRequest(
        {},
        {
          user_id: '',
        }
      )

      const result = await testValidator(getBalanceValidator, req)

      expect(result.isEmpty()).toBe(false)
      expect(result.array()[0].msg).toContain('User ID is required')
    })
  })
})
