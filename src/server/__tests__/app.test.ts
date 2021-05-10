import request from 'supertest'

import app from '../app'

describe('GET /', () => {
  it('expects HTTP response 200', async () => {
    const resp = await request(app).get('/')

    expect(resp.status).toBe(200)
  })
})
