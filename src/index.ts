import app from './app'
import { connectToDatabase, disconnectFromDatabase } from './database'
import { PORT, MONGODB_URI } from './config'

process.on('SIGINT', () => {
  disconnectFromDatabase(() => {
    console.log('Database disconnected through app termination')
    process.exit(0)
  })
})

const launch = async () => {
  try {
    const conn = await connectToDatabase(MONGODB_URI, 1000)
    console.log(`Database connected: ${conn.host}`)
  } catch (err) {
    console.error('Failed to connect to database')
    process.exit(1)
  }
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

launch()
