import mongoose, { Connection } from 'mongoose'

export const connectToDatabase = async (
  uri: string,
  timeoutMS = 5000
): Promise<Connection> => {
  mongoose.connection.on('error', () => {
    console.error('Database connection error')
  })

  const { connection } = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: timeoutMS,
  })
  return connection
}

export const disconnectFromDatabase = async (
  callback = async () => void 0
): Promise<void> => {
  return mongoose.connection.close(callback)
}
