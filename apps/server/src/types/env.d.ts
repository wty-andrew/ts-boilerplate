export interface IProcessEnv {
  NODE_ENV: 'development' | 'production' | 'test'
  PORT: string
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Partial<IProcessEnv> {}
  }
}
