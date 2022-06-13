const request = require('supertest')
const app = require('../app')

describe('Contracts API', () => {
  test('GET /contracts', async () => {
    const response = await request(app)
      .get('/contracts')
      .set('profile_id', 1)
      .expect(200)
    expect(response.body).toHaveLength(2)
  })

  test('GET /contracts/:id', async () => {
    const response = await request(app)
      .get('/contracts/1')
      .set('profile_id', 1)
      .expect(200)
    expect(response.body.id).toBe(1)
  })
})
