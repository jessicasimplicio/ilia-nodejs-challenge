const { body, param } = require('express-validator')

const registerUserValidator = [
  body('user.first_name')
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters')
    .matches(/^[a-zA-ZÀ-ÿ\s']+$/)
    .withMessage('First name can only contain letters and spaces'),

  body('user.last_name')
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters')
    .matches(/^[a-zA-ZÀ-ÿ\s']+$/)
    .withMessage('Last name can only contain letters and spaces'),

  body('user.email')
    .isEmail()
    .withMessage('Invalid email format')
    .isLength({ max: 100 })
    .withMessage('Email must be less than 100 characters')
    .normalizeEmail(),

  body('user.password')
    .isLength({ min: 8, max: 100 })
    .withMessage('Password must be between 8 and 100 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      'Password must contain at least one lowercase letter, one uppercase letter and one number'
    ),
]

const loginUserValidator = [
  body('user.email')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),

  body('user.password').notEmpty().withMessage('Password is required'),
]

const getUserValidator = [
  param('id')
    .notEmpty()
    .withMessage('User ID is required')
    .isMongoId()
    .withMessage('Invalid user ID format'),
]

const updateUserValidator = [
  param('id')
    .notEmpty()
    .withMessage('User ID is required')
    .isMongoId()
    .withMessage('Invalid user ID format'),

  body('first_name')
    .optional()
    .notEmpty()
    .withMessage('First name cannot be empty')
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters')
    .matches(/^[a-zA-ZÀ-ÿ\s']+$/)
    .withMessage('First name can only contain letters and spaces'),

  body('last_name')
    .optional()
    .notEmpty()
    .withMessage('Last name cannot be empty')
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters')
    .matches(/^[a-zA-ZÀ-ÿ\s']+$/)
    .withMessage('Last name can only contain letters and spaces'),

  body('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email format')
    .isLength({ max: 100 })
    .withMessage('Email must be less than 100 characters')
    .normalizeEmail(),

  body().custom((value, { req }) => {
    const { first_name, last_name, email } = req.body
    if (!first_name && !last_name && !email) {
      throw new Error('At least one field must be provided for update')
    }
    return true
  }),
]

const deleteUserValidator = [
  param('id')
    .notEmpty()
    .withMessage('User ID is required')
    .isMongoId()
    .withMessage('Invalid user ID format'),
]

module.exports = {
  registerUserValidator,
  loginUserValidator,
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
}
