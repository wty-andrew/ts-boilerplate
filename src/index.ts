import app from './app.js'
import { PORT } from './config.js'
import logger from './logger.js'

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
