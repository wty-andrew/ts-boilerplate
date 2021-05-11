import path from 'path'
import express, { Application } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import passport from 'passport'

import { isDev, isProd } from './config'
import './middlewares/passport'
import router from './routes'
import { errorHandler } from './middlewares/error-handler'

const app: Application = express()

app.use(cors())
app.use(cookieParser())

if (isDev()) {
  app.use(morgan('dev'))
}

app.use(express.json())
if (isProd()) {
  app.use(express.static(path.join(__dirname, '../client')))
}
app.use(express.static(path.join(__dirname, '../../public')))
app.use(passport.initialize())

router(app)

app.use(errorHandler)

export default app
