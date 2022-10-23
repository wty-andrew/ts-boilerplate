import { Request } from 'express'
import {
  body,
  param,
  validationResult,
  ValidationChain,
} from 'express-validator'
import { ObjectId } from 'mongodb'

import { Role } from '../models/User'

export const fieldsValidation =
  (...rules: ValidationChain[]) =>
  async (req: Request): Promise<void> => {
    await Promise.all(rules.map((rule) => rule.run(req)))

    const errors = validationResult(req)
    if (!errors.isEmpty()) errors.throw()
  }

export const makeOptional = (rule: ValidationChain): ValidationChain =>
  rule.optional()

// common rules
export const checkUsername = body('name')
  .isString()
  .notEmpty()
  .withMessage('Username cannot be empty')

export const checkEmail = body('email', 'Invalid email address')
  .normalizeEmail({ gmail_remove_dots: false })
  .isEmail()

export const checkPassword = body('password')
  .isString()
  .isLength({ min: 8 })
  .withMessage('Password must contain at least 8 characters')

export const checkUserRole = body('role', 'Invalid role').isIn(
  Object.values(Role)
)

export const checkToken = body('token').isString().notEmpty()

export const checkObjectId = param('id', 'Invalid id').custom(ObjectId.isValid)
