import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express, { Application } from 'express'
import cors from 'cors'
import morgan from 'morgan'

import { isDev, isProd } from './config.js'
import { errorHandler } from './middlewares/error-handler.js'
import router from './routes/index.js'

const app: Application = express()

if (isDev()) {
  app.use(
    cors({
      credentials: true,
      origin: (origin, callback) => callback(null, true),
    })
  )
  app.use(morgan('dev'))
}

app.use(express.json())

const cwd = path.dirname(fileURLToPath(import.meta.url))
if (isProd()) {
  app.use(express.static(path.join(cwd, '../../web/build')))
}
app.use(express.static(path.join(cwd, '../../../public')))

router(app)

app.get('/', (req, res) => {
  res.status(200).send()
})

app.use(errorHandler)

export default app
