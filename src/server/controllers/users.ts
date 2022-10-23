import { RequestHandler } from 'express'
import _ from 'lodash'

import { ErrorResponse } from '../common/errors'
import {
  fieldsValidation,
  makeOptional,
  checkUsername,
  checkEmail,
  checkPassword,
  checkUserRole,
  checkObjectId,
} from '../common/validation'
import { asyncHandler } from '../middlewares/error-handler'
import { ParsedQuery } from '../middlewares/parse-query'
import User from '../models/User'

export const getUsers: RequestHandler = asyncHandler(async (req, res) => {
  const { skip, limit, sort } = req.parsedQuery as ParsedQuery
  const [users, total] = await Promise.all([
    User.find().sort(sort).skip(skip).limit(limit),
    User.countDocuments(),
  ])

  res
    .status(200)
    .json({ success: true, data: users, meta: req.getPaginateMeta?.(total) })
})

export const getUser: RequestHandler = asyncHandler(async (req, res) => {
  await fieldsValidation(checkObjectId)(req)

  const user = await User.findById(req.params.id)
  if (!user) throw new ErrorResponse(404, 'User not found')

  res.status(200).json({ success: true, data: user })
})

export const createUser: RequestHandler = asyncHandler(async (req, res) => {
  await fieldsValidation(
    checkUsername,
    checkEmail,
    checkPassword,
    makeOptional(checkUserRole)
  )(req)

  const existUser = await User.findOne({ email: req.body.email })
  if (existUser) {
    throw new ErrorResponse(
      400,
      'An account with this email address already exists'
    )
  }

  const fields = _.pick(req.body, ['name', 'email', 'password', 'role'])
  const user = await User.create(fields)

  res.status(201).json({ success: true, data: user })
})

export const updateUser: RequestHandler = asyncHandler(async (req, res) => {
  await fieldsValidation(
    checkObjectId,
    makeOptional(checkUsername),
    makeOptional(checkEmail),
    makeOptional(checkUserRole)
  )(req)

  const { name, email, role } = _.pick(req.body, ['name', 'email', 'role'])

  const existUser = email && (await User.findOne({ email }))
  if (existUser)
    throw new ErrorResponse(400, 'Cannot upadte to an email already in use')

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { name, email, role },
    { new: true, runValidators: true }
  )
  if (!user) throw new ErrorResponse(404, 'User not found')

  res.status(200).json({ success: true, data: user })
})

export const deleteUser: RequestHandler = asyncHandler(async (req, res) => {
  await fieldsValidation(checkObjectId)(req)

  const user = await User.findByIdAndDelete(req.params.id)
  if (!user) throw new ErrorResponse(404, 'User not found')

  res.status(200).json({ success: true })
})
