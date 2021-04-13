import request from 'supertest'

import { connectToDatabase, disconnectFromDatabase } from '../database'
import User from '../models/User'
import app from '../app'

import { extractCookies } from '../../jest/helpers'

beforeAll(async () => await connectToDatabase(process.env.__MONGODB_URI__))

afterAll(disconnectFromDatabase)

const users = [
  {
    name: 'Andy',
    email: 'andy@example.com',
    password: 'p4$$w0rd',
  },
  {
    name: 'Bob',
    email: 'bob@example.com',
    password: 'abcd1234',
  },
]

const newUser1 = {
  name: 'Carter',
  email: 'carter@example.com',
  password: '12345678',
}

const newUser2 = {
  name: 'David',
  email: 'david@example.com',
  password: '87654321',
}

beforeEach(async () => {
  await User.deleteMany()
  for (const user of users) {
    await new User(user).save()
  }
})

describe('POST /auth/signup', () => {
  it('should create a new user', async () => {
    const resp = await request(app).post('/auth/signup').send(newUser1)
    const cookies = extractCookies(resp.get('Set-Cookie'))

    expect(resp.status).toBe(201)
    expect(resp.body).toMatchObject({
      success: true,
      data: { name: newUser1.name, email: newUser1.email },
    })
    expect(cookies['x-auth']).toMatchObject({
      value: expect.stringMatching(/.+/),
    })
  })

  it('should not create user with malformed field', async () => {
    const resp = await request(app)
      .post('/auth/signup')
      .send({ ...newUser2, email: 'bad@email@address' })
    const cookies = extractCookies(resp.get('Set-Cookie'))

    expect(resp.status).toBe(400)
    expect(resp.body).toMatchObject({
      success: false,
      message: expect.any(String),
    })
    expect(cookies['x-auth']).toBeUndefined()
  })

  it('should not create user if email in use', async () => {
    const resp = await request(app)
      .post('/auth/signup')
      .send({ ...newUser2, email: users[0].email })
    const cookies = extractCookies(resp.get('Set-Cookie'))

    expect(resp.status).toBe(400)
    expect(resp.body).toMatchObject({
      success: false,
      message: expect.any(String),
    })
    expect(cookies['x-auth']).toBeUndefined()
  })
})

describe('POST /auth/login', () => {
  it('should login user', async () => {
    const resp = await request(app).post('/auth/login').send({
      email: users[0].email,
      password: users[0].password,
    })
    const cookies = extractCookies(resp.get('Set-Cookie'))

    expect(resp.status).toBe(200)
    expect(resp.body).toMatchObject({
      success: true,
      data: {
        name: users[0].name,
        email: users[0].email,
      },
    })
    expect(cookies['x-auth']).toMatchObject({
      value: expect.stringMatching(/.+/),
    })
  })

  it('should not login user with wrong credentials', async () => {
    const resp = await request(app)
      .post('/auth/login')
      .send({
        email: users[0].email,
        password: users[0].password + '0',
      })
    const cookies = extractCookies(resp.get('Set-Cookie'))

    expect(resp.status).toBe(401)
    expect(resp.body).toMatchObject({
      success: false,
      message: expect.any(String),
    })
    expect(cookies['x-auth']).toBeUndefined()
  })
})

describe('GET /auth/logout', () => {
  it('should logout user', async () => {
    const resp = await request(app).get('/auth/logout')
    const cookies = extractCookies(resp.get('Set-Cookie'))

    expect(resp.body).toMatchObject({ success: true })
    expect(cookies['x-auth']).toMatchObject({
      value: '',
    })
  })
})

describe('GET /auth/verify', () => {
  it('should return 200 for logged in user', async () => {
    const { headers } = await request(app).post('/auth/login').send({
      email: users[0].email,
      password: users[0].password,
    })
    const resp = await request(app)
      .get('/auth/verify')
      .set('Cookie', headers['set-cookie'])
    const cookies = extractCookies(resp.get('Set-Cookie'))

    expect(resp.status).toBe(200)
    expect(resp.body).toMatchObject({
      success: true,
      data: {
        name: users[0].name,
        email: users[0].email,
      },
    })
    expect(cookies['x-auth']).toMatchObject({
      value: expect.stringMatching(/.+/),
    })
  })

  it('should return 401 if user not logged in', async () => {
    const resp = await request(app).get('/auth/verify')
    const cookies = extractCookies(resp.get('Set-Cookie'))

    expect(resp.status).toBe(401)
    expect(resp.body).toMatchObject({
      success: false,
      message: expect.any(String),
    })
    expect(cookies['x-auth']).toBeUndefined()
  })
})
