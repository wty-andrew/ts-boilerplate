import request from 'supertest'

import app from '../app.js'

test('index route should return 200', async () => {
  const resp = await request(app).get('/')

  expect(resp.status).toBe(200)
})
