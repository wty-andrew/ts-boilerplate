import { Document, model, Model, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'
import isEmail from 'validator/lib/isEmail'

import { User, Role } from '../../shared/types/user'
export { User, Role }

export interface IUser extends User {
  password?: string
}

export interface UserDocument extends IUser, Document {
  verifyPassword(password: string): Promise<boolean>
}

type UserModel = Model<UserDocument>

const UserSchema = new Schema<UserDocument, UserModel>(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      validate: [isEmail, 'Invalid email address'],
    },
    password: {
      type: String,
      trim: true,
      minlength: [8, 'Password must contain at least 8 characters'],
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.Guest,
    },
  },
  { timestamps: true }
)

UserSchema.pre('save', async function (next) {
  const user = this as UserDocument
  if (!user.isModified('password')) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password as string, salt)
    next()
  } catch (err) {
    next(err)
  }
})

UserSchema.methods.verifyPassword = function (
  password: string
): Promise<boolean> {
  const user = this as UserDocument
  return bcrypt.compare(password, user.password as string)
}

// https://github.com/Automattic/mongoose/issues/1020
UserSchema.methods.toJSON = function () {
  const user = this.toObject()
  delete user.__v
  delete user.password
  return user
}

export default model<UserDocument, UserModel>('User', UserSchema)
