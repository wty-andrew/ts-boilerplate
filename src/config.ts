import path from 'path'
import dotenv from 'dotenv'

dotenv.config({
  path: path.join(__dirname, `../config/${process.env.NODE_ENV}.env`),
})

export const isProd = (): boolean => process.env.NODE_ENV === 'production'
export const isDev = (): boolean => process.env.NODE_ENV === 'development'

const env = <K extends keyof NodeJS.ProcessEnv>(
  name: K,
  default_?: NodeJS.ProcessEnv[K]
): NodeJS.ProcessEnv[K] => {
  const value = process.env[name]
  if (value === undefined && default_ === undefined) {
    throw new Error(`Missing env variable: ${name}`)
  }
  return value || default_
}

export const PORT = env('PORT', 3000)
export const MONGODB_URI = env('MONGODB_URI')
export const JWT_SECRET = env('JWT_SECRET')
export const JWT_EXPIRE = env('JWT_EXPIRE')