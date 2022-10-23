import { RequestHandler, ErrorRequestHandler } from 'express'
import { Result } from 'express-validator'

import { isDev } from '../config'
import { ErrorResponse } from '../common/errors'

export const asyncHandler =
  (handler: RequestHandler): RequestHandler =>
  (req, res, next) =>
    Promise.resolve(handler(req, res, next)).catch(next)

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  // body-parser error, see: https://github.com/expressjs/body-parser/issues/122
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'Malformed body' })
  }
  if (err instanceof ErrorResponse) {
    return res
      .status(err.statusCode)
      .json({ success: false, message: err.message })
  }
  // hacky way to check if error comes from express-validator
  if (
    Object.getOwnPropertyNames(Result.prototype)
      .filter((prop) => prop !== 'constructor')
      .every((prop) => Object.prototype.hasOwnProperty.call(err, prop))
  ) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      error: (err as Result)
        .array()
        .reduce((prev, curr) => ({ ...prev, [curr.param]: curr.msg }), {}),
    })
  }

  res.status(500).json({
    success: false,
    message: isDev() ? err.message : 'Unexpected condition',
  })
}
