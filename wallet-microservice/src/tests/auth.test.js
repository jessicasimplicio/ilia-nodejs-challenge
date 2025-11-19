jest.mock('jsonwebtoken')

let jwt
let auth

describe('Auth Middleware', () => {
  let req, res, next

  beforeEach(() => {
    jest.resetModules()
    process.env.JWT_INTERNAL_SECRET = 'internal-secret'
    process.env.JWT_SECRET = 'regular-secret'

    jwt = require('jsonwebtoken')
    auth = require('../middleware/auth')

    jest.clearAllMocks()

    req = { headers: {} }
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
    next = jest.fn()
  })

  it('should return 401 when there is no token', () => {
    auth(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Access token is missing or invalid',
    })
  })

  it('should return 401 when authorization header does not start with Bearer', () => {
    req.headers.authorization = 'Invalid token'

    jwt.verify.mockImplementation(() => {
      throw new Error()
    })

    auth(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
  })

  it('should return 401 when token is empty', () => {
    req.headers.authorization = 'Bearer '

    auth(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
  })

  it('should accept valid internal token with user_id', () => {
    req.headers.authorization = 'Bearer internal-token'
    const decoded = { user_id: '123' }

    jwt.verify.mockImplementation((token, secret) => {
      if (secret === 'internal-secret' && token === 'internal-token') {
        return decoded
      }
      throw new Error('Invalid token')
    })

    auth(req, res, next)

    expect(jwt.verify).toHaveBeenCalledWith('internal-token', 'internal-secret')
    expect(req.user).toEqual({ id: '123' })
    expect(next).toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
  })

  it('should accept valid internal token with service when user_id does not exist', () => {
    req.headers.authorization = 'Bearer internal-token'
    const decoded = { service: 'my-service' }

    jwt.verify.mockReturnValue(decoded)

    auth(req, res, next)

    expect(req.user).toEqual({ id: 'my-service' })
    expect(next).toHaveBeenCalled()
  })

  it('should accept valid regular token when internal token fails', () => {
    req.headers.authorization = 'Bearer regular-token'
    const decoded = { id: '456', name: 'Test User' }

    jwt.verify
      .mockImplementationOnce(() => { throw new Error() })
      .mockReturnValue(decoded)

    auth(req, res, next)

    expect(jwt.verify).toHaveBeenCalledTimes(2)
    expect(req.user).toEqual(decoded)
    expect(next).toHaveBeenCalled()
  })

  it('should return 401 when both tokens fail', () => {
    req.headers.authorization = 'Bearer invalid-token'

    jwt.verify.mockImplementation(() => {
      throw new Error()
    })

    auth(req, res, next)

    expect(jwt.verify).toHaveBeenCalledTimes(2)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
  })

    it('should accept regular token when internal token is expired', () => {
      req.headers.authorization = 'Bearer token'
      const decodedNormal = { id: '789' }

      jwt.verify
        .mockImplementationOnce(() => { throw new Error('Token expired') })
        .mockReturnValue(decodedNormal)

      auth(req, res, next)

      expect(req.user).toEqual(decodedNormal)
      expect(next).toHaveBeenCalled()
    })

    it('should verify internal token before regular token', () => {
      req.headers.authorization = 'Bearer token'
      const decoded = { user_id: '111' }

      jwt.verify.mockReturnValue(decoded)

      auth(req, res, next)

      expect(jwt.verify.mock.calls[0][1]).toBe('internal-secret')
      expect(next).toHaveBeenCalled()
    })

    it('should return 401 for token with Bearer but invalid content', () => {
      req.headers.authorization = 'Bearer any-invalid-token'

      jwt.verify.mockImplementation(() => { throw new Error() })

      auth(req, res, next)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({ error: 'Access token is missing or invalid' })
    })
})
