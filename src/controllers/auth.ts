import crypto from 'crypto'
import { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'

import { JWT_SECRET, JWT_EXPIRE } from '../config'
import { JwtPayload } from '../common/types'
import { ErrorResponse } from '../common/errors'
import { asyncHandler } from '../middlewares/error-handler'
import User, { Role, UserDocument } from '../models/User'
import Token from '../models/Token'
import {
  sendConfirmationEmail,
  sendForgotPasswordEmail,
  sendPasswordResetEmail,
} from '../services/email'

const generateAuthToken = (user: UserDocument): string => {
  const payload: JwtPayload = { id: user._id }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE })
}

const generateRandomToken = (): string => crypto.randomBytes(32).toString('hex')

const hashToken = (token: string): string =>
  crypto.createHash('sha256').update(token).digest('hex')

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

  const activationToken = generateRandomToken()
  await Token.create({ userId: user._id, value: hashToken(activationToken) })

  await sendConfirmationEmail({ name, address: email }, activationToken)

  const authToken = generateAuthToken(user)
  res
    .cookie('x-auth', authToken, { httpOnly: true })
    .status(201)
    .json({ success: true, data: user })
})

export const login: RequestHandler = (req, res) => {
  const user = req.user as UserDocument
  const token = generateAuthToken(user)
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
  const token = generateAuthToken(user)
  res
    .cookie('x-auth', token, { httpOnly: true })
    .status(200)
    .json({ success: true, data: user })
}

export const activateAccount: RequestHandler = asyncHandler(
  async (req, res) => {
    const { email, token: activationToken } = req.body

    const token = await Token.findOne({ value: hashToken(activationToken) })
    if (!token) throw new ErrorResponse(400, 'Invalid or expired token')

    const user = await User.findOne({ _id: token.userId, email })
    if (!user) throw new ErrorResponse(400, 'Invalid email or token')

    if (user.role !== Role.Guest) {
      return res
        .status(400)
        .json({ success: false, message: 'User account already activated' })
    }

    user.role = Role.User
    await user.save()
    await token.deleteOne()

    res.status(200).json({ success: true })
  }
)

export const resendActivation: RequestHandler = asyncHandler(
  async (req, res) => {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (user) {
      const activationToken = generateRandomToken()
      await Token.create({
        userId: user._id,
        value: hashToken(activationToken),
      })

      await sendConfirmationEmail(
        { name: user.name, address: email },
        activationToken
      )
    }

    res.status(200).json({ success: true })
  }
)

export const forgotPassword: RequestHandler = asyncHandler(async (req, res) => {
  const { email } = req.body

  const user = await User.findOne({ email })
  if (user) {
    const resetToken = generateRandomToken()
    await Token.create({ userId: user._id, value: hashToken(resetToken) })

    await sendForgotPasswordEmail(
      { name: user.name, address: email },
      resetToken
    )
  }

  res.status(200).json({ success: true })
})

export const resetPassword: RequestHandler = asyncHandler(async (req, res) => {
  const { email, password, token: resetToken } = req.body

  const token = await Token.findOne({ value: hashToken(resetToken) })
  if (!token) throw new ErrorResponse(400, 'Invalid or expired token')

  const user = await User.findOne({ _id: token.userId, email })
  if (!user) throw new ErrorResponse(404, 'Invalid email or token')

  user.password = password
  await user.save()

  await sendPasswordResetEmail({ name: user.name, address: email })
  await token.deleteOne()

  res.status(200).json({ success: true })
})
