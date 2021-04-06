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
