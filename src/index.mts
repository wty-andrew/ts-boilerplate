import app from './app.mjs'
import { PORT } from './config.mjs'
import logger from './logger.mjs'

const main = () => {
  const server = app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`)
  })

  const signals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT']
  for (const signal of signals) {
    process.on(signal, () => {
      logger.info(`Received ${signal}, shutting down`)
      server.close(() => process.exit(0))
    })
  }
}

main()
