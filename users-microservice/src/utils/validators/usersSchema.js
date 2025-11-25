// utils/validators/userSchemas.js
const { z } = require('zod')

const registerUserSchema = z.object({
  body: z.object({
    user: z.object({
      first_name: z
        .string()
        .min(1, 'First name is required')
        .max(50, 'First name must be less than 50 characters')
        .regex(
          /^[a-zA-ZÀ-ÿ\s']+$/,
          'First name can only contain letters and spaces'
        ),
      last_name: z
        .string()
        .min(1, 'Last name is required')
        .max(50, 'Last name must be less than 50 characters')
        .regex(
          /^[a-zA-ZÀ-ÿ\s']+$/,
          'Last name can only contain letters and spaces'
        ),
      email: z
        .string()
        .email('Invalid email format')
        .max(100, 'Email must be less than 100 characters'),
      password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password must be less than 100 characters')
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          'Password must contain at least one lowercase letter, one uppercase letter and one number'
        ),
    }),
  }),
})

const loginUserSchema = z.object({
  body: z.object({
    user: z.object({
      email: z
        .string()
        .email('Invalid email format')
        .max(100, 'Email must be less than 100 characters'),
      password: z
        .string()
        .min(1, 'Password is required')
        .max(100, 'Password must be less than 100 characters'),
    }),
  }),
})

const getUserSchema = z.object({
  params: z.object({
    id: z
      .string()
      .min(1, 'User ID is required')
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
  }),
})

const updateUserSchema = z.object({
  params: z.object({
    id: z
      .string()
      .min(1, 'User ID is required')
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
  }),
  body: z
    .object({
      first_name: z
        .string()
        .min(1, 'First name is required')
        .max(50, 'First name must be less than 50 characters')
        .regex(
          /^[a-zA-ZÀ-ÿ\s']+$/,
          'First name can only contain letters and spaces'
        )
        .optional(),
      last_name: z
        .string()
        .min(1, 'Last name is required')
        .max(50, 'Last name must be less than 50 characters')
        .regex(
          /^[a-zA-ZÀ-ÿ\s']+$/,
          'Last name can only contain letters and spaces'
        )
        .optional(),
      email: z
        .string()
        .email('Invalid email format')
        .max(100, 'Email must be less than 100 characters')
        .optional(),
    })
    .refine((data) => {
      return Object.keys(data).length > 0
    }, 'At least one field must be provided for update'),
})

const deleteUserSchema = z.object({
  params: z.object({
    id: z
      .string()
      .min(1, 'User ID is required')
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
  }),
})

module.exports = {
  registerUserSchema,
  loginUserSchema,
  getUserSchema,
  updateUserSchema,
  deleteUserSchema,
}
