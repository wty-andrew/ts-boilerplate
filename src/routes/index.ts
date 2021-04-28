import { Router, Application } from 'express'

import authRouter from './auth'
import usersRouter from './users'

const router = (app: Application): void => {
  const apiRouter = Router()
  apiRouter.use('/users', usersRouter)

  app.use('/api', apiRouter)
  app.use('/auth', authRouter)
}

export default router
