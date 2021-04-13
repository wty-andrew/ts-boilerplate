import { RequestHandler, ErrorRequestHandler } from 'express'
import { Error as MongooseError } from 'mongoose'

import { isDev } from '../config'
import { ErrorResponse } from '../common/errors'

export const asyncHandler = (handler: RequestHandler): RequestHandler => (
  req,
  res,
  next
) => Promise.resolve(handler(req, res, next)).catch(next)

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  if (err instanceof ErrorResponse) {
    return res
      .status(err.statusCode)
      .json({ success: false, message: err.message })
  }
  if (err instanceof MongooseError.ValidationError) {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ')
    return res.status(400).json({ success: false, message })
  }

  res.status(500).json({
    success: false,
    message: isDev() ? err.message : 'Unexpected condition',
  })
}
