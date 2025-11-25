const { z } = require('zod')

const createTransactionSchema = z.object({
  body: z.object({
    user_id: z.string().min(1, 'User ID is required'),
    amount: z.number().positive('Amount must be a positive number'),
    type: z.enum(['CREDIT', 'DEBIT'], {
      errorMap: () => ({ message: "Type must be 'CREDIT' or 'DEBIT'" }),
    }),
  }),
})

const getTransactionsSchema = z.object({
  query: z.object({
    type: z.enum(['CREDIT', 'DEBIT']).optional(),
  }),
})

const getBalanceSchema = z.object({
  params: z.object({
    user_id: z.string().min(1, 'User ID is required'),
  }),
})

module.exports = {
  createTransactionSchema,
  getTransactionsSchema,
  getBalanceSchema,
  updateTransactionSchema,
}
