const request = require('supertest')
const app = require('../app')
const { Profile, Job, Contract } = require('../model')

describe('Jobs API', () => {
  test('POST /jobs/:job_id/pay', async () => {
    const clientId = 1
    const jobId = 2

    const client = await Profile.findOne({ where: { id: clientId } })
    const job = await Job.findOne({ where: { id: jobId } })
    const contract = await Contract.findOne({ where: { id: job.ContractId } })
    const contractor = await Profile.findOne({ where: { id: contract.ContractorId } })

    const response = await request(app)
      .post(`/jobs/${jobId}/pay`)
      .set('profile_id', clientId)
      .expect(200)

    expect(response.body.paid).toBe(true)
    expect(response.body.paymentDate).toBeDefined()

    const updatedJob = await Job.findOne({ where: { id: jobId } })
    const updatedClient = await Profile.findOne({ where: { id: clientId } })
    const updatedContractor = await Profile.findOne({ where: { id: contract.ContractorId } })

    expect(updatedJob.paid).toBe(true)
    expect(updatedJob.paymentDate).toBeDefined()
    expect(updatedClient.balance).toBe(client.balance - job.price)
    expect(updatedContractor.balance).toBe(contractor.balance + job.price)
  })
})
