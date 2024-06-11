import type { ErrorRequestHandler, RequestHandler } from 'express'

import { ErrorResponse } from '../common/errors.mjs'
import { isDev } from '../config.mjs'

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

  res.status(500).json({
    success: false,
    message: isDev ? err.message : 'Unexpected condition',
  })
}
