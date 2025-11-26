const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
}

const ERROR_MESSAGES = {
  USER_NOT_FOUND: 'User not found',
  USER_ALREADY_EXISTS: 'User already exists',
  INVALID_CREDENTIALS: 'Invalid credentials',
  REGISTRATION_FAILED: 'Error when registering user',
}

module.exports = { HTTP_STATUS, ERROR_MESSAGES }

