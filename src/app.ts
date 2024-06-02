import path from 'node:path'
import cors from 'cors'
import express from 'express'
import pinoHttp from 'pino-http'
import { v4 as uuidv4 } from 'uuid'

import { isDev } from './config.js'
import logger from './logger.js'
import { errorHandler } from './middlewares/error-handler.js'
import router from './routes/index.js'

const app = express()

if (isDev) {
  app.use(cors())
}

const httpLogger = pinoHttp({
  logger,
  genReqId: (req, res) => {
    const existingID = req.id ?? req.headers['x-request-id']
    if (existingID) return existingID
    const id = uuidv4()
    res.setHeader('x-request-id', id)
    return id
  },
})

app.use(httpLogger)
app.use(express.json())
app.use(express.static(path.resolve(import.meta.dirname, '../public')))

router(app)

app.get('/healthz', (req, res) => {
  res.status(200).send()
})

app.use((req, res, next) => res.status(404).send())

app.use(errorHandler)

export default app
