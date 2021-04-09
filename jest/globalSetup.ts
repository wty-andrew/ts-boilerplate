import { MongoMemoryServer } from 'mongodb-memory-server'

export default async (): Promise<void> => {
  const mongod = new MongoMemoryServer()
  await mongod.start()
  ;(global as any).__MONGOD__ = mongod
  process.env.__MONGODB_URI__ = await mongod.getUri()
}
