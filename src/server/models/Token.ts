import { Document, model, Schema, Types } from 'mongoose'

interface Token {
  userId: Types.ObjectId
  value: string
  createdAt: Date
}

export interface TokenDocument extends Token, Document {}

const TokenSchema = new Schema<TokenDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  value: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '20m',
  },
})

export default model<TokenDocument>('Token', TokenSchema)
