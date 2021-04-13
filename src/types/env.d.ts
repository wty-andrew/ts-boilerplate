declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test'
    readonly PORT: string | number
    readonly MONGODB_URI: string
    __MONGODB_URI__: string // used only in testing
    readonly JWT_SECRET: string
    readonly JWT_EXPIRE: string
  }
}
