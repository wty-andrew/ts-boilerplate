import request from 'supertest'

import app from '../app.mjs'

describe('GET /healthz', () => {
  it('returns status 200', async () => {
    const resp = await request(app).get('/healthz')

    expect(resp.status).toBe(200)
  })
})

describe('GET /non-exist-endpoint', () => {
  it('returns status 404', async () => {
    const resp = await request(app).get('/non-exist-endpoint')

    expect(resp.status).toBe(404)
  })
})
