import dotenv from 'dotenv'

dotenv.config({ path: [`.env.${process.env.NODE_ENV}`, '.env'] })

export const isProd = process.env.NODE_ENV === 'production'
export const isDev = process.env.NODE_ENV === 'development'

const env = (name: string, default_?: string): string => {
  const value = process.env[name] || default_
  if (value === undefined) throw new Error(`Missing env variable: ${name}`)
  return value
}

export const PORT = Number(env('PORT', '8000'))
