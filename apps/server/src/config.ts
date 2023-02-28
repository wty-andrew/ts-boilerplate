import dotenv from 'dotenv'
import { findUpSync } from 'find-up'

dotenv.config({
  path: findUpSync(`.env.${process.env.NODE_ENV}`),
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

export const PORT = Number(env('PORT', '3000'))
export const BASE_URL = env('BASE_URL')
