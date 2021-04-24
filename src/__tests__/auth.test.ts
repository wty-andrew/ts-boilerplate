import request from 'supertest'
import { mocked } from 'ts-jest/utils'

import { connectToDatabase, disconnectFromDatabase } from '../database'
import User, { Role } from '../models/User'
import Token from '../models/Token'
import app from '../app'
import * as emailService from '../services/email'
jest.mock('../services/email')

import { extractCookies } from '../../jest/helpers'

const mockedEmailService = mocked(emailService)

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
  mockedEmailService.sendConfirmationEmail.mockClear()
  mockedEmailService.sendForgotPasswordEmail.mockClear()
  mockedEmailService.sendPasswordResetEmail.mockClear()

  await User.deleteMany()
  await Token.deleteMany()
  for (const user of users) {
    await new User(user).save()
  }
})

describe('POST /auth/signup', () => {
  it('should create a new user and send confirmation email', async () => {
    const resp = await request(app).post('/auth/signup').send(newUser1)
    const cookies = extractCookies(resp.get('Set-Cookie'))

    const { name, email } = newUser1
    expect(resp.status).toBe(201)
    expect(resp.body).toMatchObject({
      success: true,
      data: { name, email, role: Role.Guest },
    })
    expect(cookies['x-auth']).toMatchObject({
      value: expect.stringMatching(/.+/),
    })
    expect(mockedEmailService.sendConfirmationEmail).toHaveBeenCalledWith(
      {
        name,
        address: email,
      },
      expect.any(String)
    )
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

describe('POST /auth/activation', () => {
  it('should change user role from Guest to User', async () => {
    await request(app).post('/auth/signup').send(newUser1)

    const token = mockedEmailService.sendConfirmationEmail.mock.calls[0][1]
    await request(app).post('/auth/activation').send({
      email: newUser1.email,
      token,
    })

    const resp = await request(app).post('/auth/login').send({
      email: newUser1.email,
      password: newUser1.password,
    })

    expect(resp.body).toMatchObject({
      success: true,
      data: { role: Role.User },
    })
  })
})

describe('POST /auth/resend-activation', () => {
  it('should send confirmation email', async () => {
    const { name, email } = newUser1
    await request(app).post('/auth/signup').send(newUser1)

    const resp = await request(app).post('/auth/resend-activation').send({
      email,
    })

    expect(resp.status).toBe(200)
    expect(resp.body).toMatchObject({ success: true })
    expect(mockedEmailService.sendConfirmationEmail).toHaveBeenCalledWith(
      {
        name,
        address: email,
      },
      expect.any(String)
    )
  })
})

describe('POST /auth/forgot-password', () => {
  it('should send password reset instruction email', async () => {
    const { name, email } = users[0]
    const resp = await request(app)
      .post('/auth/forgot-password')
      .send({ email })

    expect(resp.status).toBe(200)
    expect(resp.body).toMatchObject({ success: true })

    expect(mockedEmailService.sendForgotPasswordEmail).toHaveBeenCalledWith(
      {
        name,
        address: email,
      },
      expect.any(String)
    )
  })
})

describe('POST /auth/reset-password', () => {
  it('should reset user password and send reset success email', async () => {
    const { name, email, password } = users[0]
    const newPassword = password + '0'
    await request(app).post('/auth/forgot-password').send({ email })

    const token = mockedEmailService.sendForgotPasswordEmail.mock.calls[0][1]
    const resp = await request(app).post('/auth/reset-password').send({
      email,
      password: newPassword,
      token,
    })

    expect(resp.status).toBe(200)
    expect(mockedEmailService.sendPasswordResetEmail).toHaveBeenCalledWith({
      name,
      address: email,
    })

    const resp2 = await request(app)
      .post('/auth/login')
      .send({ email, password: newPassword })
    expect(resp2.status).toBe(200)
  })
})
