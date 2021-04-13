import { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'

import { JWT_SECRET, JWT_EXPIRE } from '../config'
import { JwtPayload } from '../common/types'
import { ErrorResponse } from '../common/errors'
import { asyncHandler } from '../middlewares/error-handler'
import User, { UserDocument } from '../models/User'

const generateToken = (user: UserDocument): string => {
  const payload: JwtPayload = { id: user._id }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE })
}

export const signup: RequestHandler = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  const existUser = await User.findOne({ email })
  if (existUser) {
    throw new ErrorResponse(
      400,
      'An account with this email address already exists'
    )
  }

  const user = await User.create({ name, email, password })
  const token = generateToken(user)
  res
    .cookie('x-auth', token, { httpOnly: true })
    .status(201)
    .json({ success: true, data: user })
})

export const login: RequestHandler = (req, res) => {
  const user = req.user as UserDocument
  const token = generateToken(user)
  res
    .cookie('x-auth', token, { httpOnly: true })
    .status(200)
    .json({ success: true, data: user })
}

export const logout: RequestHandler = (req, res) => {
  res.clearCookie('x-auth').status(200).json({ success: true })
}

export const verify: RequestHandler = (req, res) => {
  const user = req.user as UserDocument
  const token = generateToken(user)
  res
    .cookie('x-auth', token, { httpOnly: true })
    .status(200)
    .json({ success: true, data: user })
}
