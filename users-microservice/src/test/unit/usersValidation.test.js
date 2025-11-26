const { validationResult } = require('express-validator')
const {
  registerUserValidator,
  loginUserValidator,
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
} = require('../../utils/validators/usersValidators')

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

describe('User Validators', () => {
  describe('registerUserValidator', () => {
    it('should pass validation with correct data', async () => {
      const req = createMockRequest({
        user: {
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
          password: 'Password123',
        },
      })

      const result = await testValidator(registerUserValidator, req)

      expect(result.isEmpty()).toBe(true)
    })

    it('should fail validation with missing first_name', async () => {
      const req = createMockRequest({
        user: {
          last_name: 'Doe',
          email: 'john@example.com',
          password: 'Password123',
        },
      })

      const result = await testValidator(registerUserValidator, req)

      expect(result.isEmpty()).toBe(false)
      expect(result.array()[0].msg).toContain('First name is required')
    })

    it('should fail validation with weak password', async () => {
      const req = createMockRequest({
        user: {
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
          password: 'weak',
        },
      })

      const result = await testValidator(registerUserValidator, req)

      expect(result.isEmpty()).toBe(false)
      expect(result.array()[0].msg).toContain(
        'Password must be between 8 and 100 characters'
      )
    })

    it('should fail validation with invalid email', async () => {
      const req = createMockRequest({
        user: {
          first_name: 'John',
          last_name: 'Doe',
          email: 'invalid-email',
          password: 'Password123',
        },
      })

      const result = await testValidator(registerUserValidator, req)

      expect(result.isEmpty()).toBe(false)
      expect(result.array()[0].msg).toContain('Invalid email format')
    })

    it('should fail validation with special characters in names', async () => {
      const req = createMockRequest({
        user: {
          first_name: 'John123',
          last_name: 'Doe!',
          email: 'john@example.com',
          password: 'Password123',
        },
      })

      const result = await testValidator(registerUserValidator, req)

      expect(result.isEmpty()).toBe(false)
      expect(result.array()[0].msg).toContain(
        'First name can only contain letters and spaces'
      )
    })

    it('should fail validation with names too long', async () => {
      const req = createMockRequest({
        user: {
          first_name: 'A'.repeat(51),
          last_name: 'Doe',
          email: 'john@example.com',
          password: 'Password123',
        },
      })

      const result = await testValidator(registerUserValidator, req)

      expect(result.isEmpty()).toBe(false)
      expect(result.array()[0].msg).toContain(
        'First name must be between 1 and 50 characters'
      )
    })
  })

  describe('loginUserValidator', () => {
    it('should pass validation with correct data', async () => {
      const req = createMockRequest({
        user: {
          email: 'john@example.com',
          password: 'anypassword',
        },
      })

      const result = await testValidator(loginUserValidator, req)

      expect(result.isEmpty()).toBe(true)
    })

    it('should fail validation with missing email', async () => {
      const req = createMockRequest({
        user: {
          password: 'anypassword',
        },
      })

      const result = await testValidator(loginUserValidator, req)

      expect(result.isEmpty()).toBe(false)
      expect(result.array()[0].msg).toContain('Invalid email format')
    })

    it('should fail validation with missing password', async () => {
      const req = createMockRequest({
        user: {
          email: 'john@example.com',
          password: '',
        },
      })

      const result = await testValidator(loginUserValidator, req)

      expect(result.isEmpty()).toBe(false)
      expect(result.array()[0].msg).toContain('Password is required')
    })

    it('should fail validation with invalid email format', async () => {
      const req = createMockRequest({
        user: {
          email: 'invalid-email',
          password: 'anypassword',
        },
      })

      const result = await testValidator(loginUserValidator, req)

      expect(result.isEmpty()).toBe(false)
      expect(result.array()[0].msg).toContain('Invalid email format')
    })
  })

  describe('getUserValidator', () => {
    it('should pass validation with valid MongoDB ID', async () => {
      const req = createMockRequest(
        {},
        {
          id: '507f1f77bcf86cd799439011',
        }
      )

      const result = await testValidator(getUserValidator, req)

      expect(result.isEmpty()).toBe(true)
    })

    it('should fail validation with missing ID', async () => {
      const req = createMockRequest(
        {},
        {
          id: '',
        }
      )

      const result = await testValidator(getUserValidator, req)

      expect(result.isEmpty()).toBe(false)
      expect(result.array()[0].msg).toContain('User ID is required')
    })

    it('should fail validation with invalid MongoDB ID', async () => {
      const req = createMockRequest(
        {},
        {
          id: 'invalid-id',
        }
      )

      const result = await testValidator(getUserValidator, req)

      expect(result.isEmpty()).toBe(false)
      expect(result.array()[0].msg).toContain('Invalid user ID format')
    })
  })

  describe('updateUserValidator', () => {
    it('should pass validation with valid data', async () => {
      const req = createMockRequest(
        {
          first_name: 'Johnny',
          email: 'johnny@example.com',
        },
        {
          id: '507f1f77bcf86cd799439011',
        }
      )

      const result = await testValidator(updateUserValidator, req)

      expect(result.isEmpty()).toBe(true)
    })

    it('should pass validation with only one field', async () => {
      const req = createMockRequest(
        {
          first_name: 'Johnny',
        },
        {
          id: '507f1f77bcf86cd799439011',
        }
      )

      const result = await testValidator(updateUserValidator, req)

      expect(result.isEmpty()).toBe(true)
    })

    it('should fail validation with no fields to update', async () => {
      const req = createMockRequest(
        {},
        {
          id: '507f1f77bcf86cd799439011',
        }
      )

      const result = await testValidator(updateUserValidator, req)

      expect(result.isEmpty()).toBe(false)
      expect(result.array()[0].msg).toContain(
        'At least one field must be provided for update'
      )
    })

    it('should fail validation with empty first_name', async () => {
      const req = createMockRequest(
        {
          first_name: '',
        },
        {
          id: '507f1f77bcf86cd799439011',
        }
      )

      const result = await testValidator(updateUserValidator, req)

      expect(result.isEmpty()).toBe(false)
      expect(result.array()[0].msg).toContain('First name cannot be empty')
    })

    it('should fail validation with invalid email', async () => {
      const req = createMockRequest(
        {
          email: 'invalid-email',
        },
        {
          id: '507f1f77bcf86cd799439011',
        }
      )

      const result = await testValidator(updateUserValidator, req)

      expect(result.isEmpty()).toBe(false)
      expect(result.array()[0].msg).toContain('Invalid email format')
    })

    it('should fail validation with invalid MongoDB ID', async () => {
      const req = createMockRequest(
        {
          first_name: 'Johnny',
        },
        {
          id: 'invalid-id',
        }
      )

      const result = await testValidator(updateUserValidator, req)

      expect(result.isEmpty()).toBe(false)
      expect(result.array()[0].msg).toContain('Invalid user ID format')
    })
  })

  describe('deleteUserValidator', () => {
    it('should pass validation with valid MongoDB ID', async () => {
      const req = createMockRequest(
        {},
        {
          id: '507f1f77bcf86cd799439011',
        }
      )

      const result = await testValidator(deleteUserValidator, req)

      expect(result.isEmpty()).toBe(true)
    })

    it('should fail validation with missing ID', async () => {
      const req = createMockRequest(
        {},
        {
          id: '',
        }
      )

      const result = await testValidator(deleteUserValidator, req)

      expect(result.isEmpty()).toBe(false)
      expect(result.array()[0].msg).toContain('User ID is required')
    })

    it('should fail validation with invalid MongoDB ID', async () => {
      const req = createMockRequest(
        {},
        {
          id: 'invalid-id',
        }
      )

      const result = await testValidator(deleteUserValidator, req)

      expect(result.isEmpty()).toBe(false)
      expect(result.array()[0].msg).toContain('Invalid user ID format')
    })
  })
})
