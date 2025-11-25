const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
}

const ERROR_MESSAGES = {
  TRANSACTION_CREATION_FAILED: 'Error when creating transaction',
  TRANSACTION_FETCH_FAILED: 'Error when fetching transactions',
  BALANCE_FETCH_FAILED: 'Error when fetching balance',
  INVALID_TRANSACTION_TYPE: "Invalid transaction type: must be 'CREDIT' or 'DEBIT'",
  MISSING_USER_ID: 'Missing user_id parameter',
  INVALID_AMOUNT: 'Invalid amount'
}

const SUCCESS_MESSAGES = {
  TRANSACTION_CREATED: 'Transaction created successfully',
  TRANSACTIONS_FOUND: 'Transactions found successfully',
  BALANCE_CALCULATED: 'Balance calculated successfully'
}

module.exports = { HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES }