import path from 'path'
import express, { Application } from 'express'
import cors from 'cors'
import morgan from 'morgan'

import { isDev } from './config'

const app: Application = express()

app.use(cors())

if (isDev()) {
  app.use(morgan('dev'))
}

app.use(express.json())
app.use(express.static(path.join(__dirname, '../public')))

app.get('/', (req, res) => {
  res.status(200).send('ok')
})

export default app
