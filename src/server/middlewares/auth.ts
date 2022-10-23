import { RequestHandler } from 'express'
import passport from 'passport'

import { ErrorResponse } from '../common/errors'
import { UserDocument, Role } from '../models/User'

export const localAuth: RequestHandler = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user) => {
    if (err) return next(err)

    if (!user) return next(new ErrorResponse(401, 'Invalid credentials'))

    req.user = user
    next()
  })(req, res, next)
}

export const protect: RequestHandler = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) return next(err)

    if (!user) return next(new ErrorResponse(401, 'Unauthorized'))

    req.user = user
    next()
  })(req, res, next)
}

export const permit =
  (...roles: Role[]): RequestHandler =>
  (req, res, next) => {
    if (!roles.includes((req.user as UserDocument).role))
      return next(new ErrorResponse(403, 'Permission denied'))

    next()
  }
