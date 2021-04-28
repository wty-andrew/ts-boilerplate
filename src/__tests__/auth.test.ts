import request from 'supertest'
import { mocked } from 'ts-jest/utils'

import { connectToDatabase, disconnectFromDatabase } from '../database'
import User, { Role, UserDocument } from '../models/User'
import Token from '../models/Token'
import app from '../app'
import { generateUser } from './fixtures/users'
import * as emailService from '../services/email'
jest.mock('../services/email')

import { extractCookies } from '../../jest/helpers'

const mockedEmailService = mocked(emailService)

beforeAll(async () => await connectToDatabase(process.env.__MONGODB_URI__))

afterAll(disconnectFromDatabase)

const existUser = generateUser()

beforeEach(async () => {
  jest.resetAllMocks()

  await User.deleteMany()
  await Token.deleteMany()
  await User.create(existUser)
})

describe('POST /auth/signup', () => {
  it('should create a new user and send confirmation email', async () => {
    const { name, email, password } = generateUser()

    const resp = await request(app)
      .post('/auth/signup')
      .send({ name, email, password })
    const cookies = extractCookies(resp.get('Set-Cookie'))

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
    const { name, password } = generateUser()

    const resp = await request(app)
      .post('/auth/signup')
      .send({ name, email: 'bad@email@address', password })
    const cookies = extractCookies(resp.get('Set-Cookie'))

    expect(resp.status).toBe(400)
    expect(resp.body).toMatchObject({
      success: false,
      message: expect.any(String),
      error: expect.anything(),
    })
    expect(cookies['x-auth']).toBeUndefined()
  })

  it('should not create user if email in use', async () => {
    const { name, password } = generateUser()

    const resp = await request(app)
      .post('/auth/signup')
      .send({ name, email: existUser.email, password })
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
    const { name, email, password } = existUser

    const resp = await request(app)
      .post('/auth/login')
      .send({ email, password })
    const cookies = extractCookies(resp.get('Set-Cookie'))

    expect(resp.status).toBe(200)
    expect(resp.body).toMatchObject({
      success: true,
      data: { name, email },
    })
    expect(cookies['x-auth']).toMatchObject({
      value: expect.stringMatching(/.+/),
    })
  })

  it('should not login user with wrong credentials', async () => {
    const { email, password } = existUser

    const resp = await request(app)
      .post('/auth/login')
      .send({ email, password: password + '0' })
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
    const { name, email, password } = existUser

    const { headers } = await request(app)
      .post('/auth/login')
      .send({ email, password })
    const resp = await request(app)
      .get('/auth/verify')
      .set('Cookie', headers['set-cookie'])
    const cookies = extractCookies(resp.get('Set-Cookie'))

    expect(resp.status).toBe(200)
    expect(resp.body).toMatchObject({
      success: true,
      data: { name, email },
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
    const { name, email, password } = generateUser()
    await request(app).post('/auth/signup').send({ name, email, password })

    const token = mockedEmailService.sendConfirmationEmail.mock.calls[0][1]
    await request(app).post('/auth/activation').send({ email, token })

    const savedUser = (await User.findOne({ email })) as UserDocument
    expect(savedUser.role).toBe(Role.User)
  })
})

describe('POST /auth/resend-activation', () => {
  it('should send confirmation email', async () => {
    const { name, email, password } = generateUser()

    await request(app).post('/auth/signup').send({ name, email, password })
    const resp = await request(app)
      .post('/auth/resend-activation')
      .send({ email })

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
    const { name, email } = existUser

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
    const { name, email, password } = existUser
    const newPassword = password + '0'

    await request(app).post('/auth/forgot-password').send({ email })

    const token = mockedEmailService.sendForgotPasswordEmail.mock.calls[0][1]
    const resp = await request(app)
      .post('/auth/reset-password')
      .send({ email, password: newPassword, token })

    expect(resp.status).toBe(200)
    expect(mockedEmailService.sendPasswordResetEmail).toHaveBeenCalledWith({
      name,
      address: email,
    })

    const user = (await User.findOne({ email })) as UserDocument
    expect(await user.verifyPassword(newPassword)).toBe(true)
  })
})
