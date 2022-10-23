import { Types } from 'mongoose'
import { faker } from '@faker-js/faker'

import { PartialBy } from '../../common/types'
import { IUser, Role } from '../../models/User'

type UserData = PartialBy<IUser & { _id?: Types.ObjectId }, 'role'>

export const generateUser = (): UserData => ({
  _id: new Types.ObjectId(),
  name: faker.name.fullName(),
  email: faker.helpers.unique(faker.internet.email).toLowerCase(),
  password: faker.internet.password(10, false, /[0-9A-Z]/),
})

export const generateUsers = (n: number): UserData[] =>
  [...Array(n)].map(generateUser)

export const generateUserWithRole = (role: Role): UserData => ({
  ...generateUser(),
  role,
})
