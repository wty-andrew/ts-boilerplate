import { Request } from 'express'
import { validationResult, ValidationChain } from 'express-validator'

export const fieldsValidation =
  (...rules: ValidationChain[]) =>
  async (req: Request): Promise<void> => {
    await Promise.all(rules.map((rule) => rule.run(req)))

    const errors = validationResult(req)
    if (!errors.isEmpty()) errors.throw()
  }

export const makeOptional = (rule: ValidationChain): ValidationChain =>
  rule.optional()
