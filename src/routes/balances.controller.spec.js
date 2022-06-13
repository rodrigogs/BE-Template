const request = require('supertest')
const app = require('../app')
const { Profile } = require('../model')

describe('Balances API', () => {
  test('POST /balances/deposit/:userId', async () => {
    const fromClientId = 2
    const toClientId = 4

    const fromClient = await Profile.findOne({ where: { id: fromClientId } })
    const toClient = await Profile.findOne({ where: { id: toClientId } })

    const response = await request(app)
      .post(`/balances/deposit/${toClientId}`)
      .set('profile_id', fromClientId)
      .send({ ammount: 10 })
      .expect(200)
    expect(response.body).toEqual({ message: 'Deposit successful.' })

    const updatedFromClient = await Profile.findOne({ where: { id: fromClientId } })
    const updatedToClient = await Profile.findOne({ where: { id: toClientId } })

    expect(updatedFromClient.balance).toBe(fromClient.balance - 10)
    expect(updatedToClient.balance).toBe(toClient.balance + 10)
  })
})
