import { Request } from 'express'
import { body, validationResult, ValidationChain } from 'express-validator'

export const fieldsValidation = (...rules: ValidationChain[]) => async (
  req: Request
): Promise<void> => {
  await Promise.all(rules.map((rule) => rule.run(req)))

  const errors = validationResult(req)
  if (!errors.isEmpty()) errors.throw()
}

// common rules
export const checkUsername = body('name')
  .isString()
  .notEmpty()
  .withMessage('Username cannot be empty')

export const checkEmail = body('email', 'Invalid email address')
  .normalizeEmail()
  .isEmail()

export const checkPassword = body('password')
  .isString()
  .isLength({ min: 8 })
  .withMessage('Password must contain at least 8 characters')

export const checkToken = body('token').isString().notEmpty()
