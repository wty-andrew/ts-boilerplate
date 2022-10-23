import path from 'path'
import express, { Application, RequestHandler } from 'express'
import cors from 'cors'
import morgan from 'morgan'

import { isDev, isProd } from './config'
import router from './routes'
import { errorHandler } from './middlewares/error-handler'

const app: Application = express()

if (isDev()) {
  app.use(
    cors({
      credentials: true,
      origin: (origin, callback) => callback(null, true),
    })
  )
  app.use(morgan('dev') as RequestHandler)
}

express.json()

app.use(express.json() as RequestHandler)
if (isProd()) {
  app.use(express.static(path.join(__dirname, '../client')))
}
app.use(express.static(path.join(__dirname, '../../public')))

router(app)

app.get('/', (req, res) => {
  res.status(200).send()
})

app.use(errorHandler)

export default app
