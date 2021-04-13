import { Application } from 'express'

import authRouter from './auth'

const router = (app: Application): void => {
  app.use('/auth', authRouter)
}

export default router
