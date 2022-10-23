import { Router, Application } from 'express'

const router = (app: Application): void => {
  const apiRouter = Router()
  // apiRouter.use(...)

  app.use('/api', apiRouter)
}

export default router
