// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./types/env.d.ts" />
import path from 'path'
import dotenv from 'dotenv'

dotenv.config({
  path: path.join(__dirname, `../../.env.${process.env.NODE_ENV}`),
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

export const PORT = Number(env('PORT', 3000))
export const BASE_URL = env('BASE_URL')
