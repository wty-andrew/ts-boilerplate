import dotenv from 'dotenv'
import { findUpSync } from 'find-up'

import type { IProcessEnv } from './types/env'

dotenv.config({
  path: findUpSync(`.env.${process.env.NODE_ENV}`),
})

export const isProd = (): boolean => process.env.NODE_ENV === 'production'
export const isDev = (): boolean => process.env.NODE_ENV === 'development'

const env = (name: keyof IProcessEnv, default_?: string) => {
  const value = process.env[name]
  if (value === undefined && default_ === undefined) {
    throw new Error(`Missing env variable: ${name}`)
  }
  return (value || default_) as string
}

export const PORT = Number(env('PORT', '3000'))
