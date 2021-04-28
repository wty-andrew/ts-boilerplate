import request from 'supertest'
import { RequestHandler } from 'express'

import { connectToDatabase, disconnectFromDatabase } from '../database'
import app from '../app'
import User, { Role } from '../models/User'
import { generateUser, generateUsers } from './fixtures/users'

jest.mock('../middlewares/auth', () => {
  const passthrough: RequestHandler = async (req, res, next) => next()

  return Object.assign({}, jest.requireActual('../middlewares/auth'), {
    protect: passthrough,
    permit: (..._: Role[]) => passthrough,
  })
})

beforeAll(async () => await connectToDatabase(process.env.__MONGODB_URI__))

afterAll(disconnectFromDatabase)

const users = generateUsers(3)

beforeEach(async () => {
  jest.resetAllMocks()

  await User.deleteMany()
  await User.create(users)
})

describe('GET /api/users', () => {
  it('should return all users', async () => {
    const resp = await request(app).get('/api/users')

    expect(resp.status).toBe(200)
    expect(resp.body).toMatchObject({
      success: true,
      data: expect.any(Array),
      meta: expect.any(Object),
    })
    expect(resp.body.data.length).toBe(users.length)
  })
})

describe('POST /api/users', () => {
  it('should create a new user', async () => {
    const { name, email, password } = generateUser()

    const resp = await request(app)
      .post('/api/users')
      .send({ name, email, password })
    expect(resp.status).toBe(201)

    const savedUser = await User.findById(resp.body.data._id)
    expect(savedUser).not.toBeNull()
  })
})

describe('GET /api/users/:id', () => {
  it('should fetche a single user', async () => {
    const { _id, name, email } = users[0]

    const resp = await request(app).get(`/api/users/${_id}`)

    expect(resp.status).toBe(200)
    expect(resp.body).toMatchObject({
      success: true,
      data: { name, email },
    })
  })

  it('should returns 404 for unknown id', async () => {
    const { _id } = generateUser()

    const resp = await request(app).get(`/api/users/${_id}`)

    expect(resp.status).toBe(404)
  })
})

describe('PUT /api/users/:id', () => {
  it('should update a user', async () => {
    const { _id } = users[0]
    const { name: newName, email: newEmail } = generateUser()

    const resp = await request(app)
      .put(`/api/users/${_id}`)
      .send({ name: newName, email: newEmail })

    expect(resp.status).toBe(200)
    expect(resp.body).toMatchObject({
      success: true,
      data: { name: newName, email: newEmail },
    })
  })

  it('should return 400 if the attempt update email already in use', async () => {
    const { _id } = users[0]
    const { email: existEmail } = users[1]

    const resp = await request(app)
      .put(`/api/users/${_id}`)
      .send({ email: existEmail })

    expect(resp.status).toBe(400)
    expect(resp.body).toMatchObject({
      success: false,
      message: expect.any(String),
    })
  })
})

describe('DELETE /api/users/:id', () => {
  it('should delete a user', async () => {
    const { _id } = users[0]

    const resp = await request(app).delete(`/api/users/${_id}`)

    expect(resp.status).toBe(200)
    expect(resp.body).toMatchObject({ success: true })

    const user = await User.findById(_id)
    expect(user).toBeNull()
  })
})
