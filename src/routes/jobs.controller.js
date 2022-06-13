const { getProfile } = require('../middleware/getProfile')
const jobsService = require('../services/jobs.service')
const contractsService = require('../services/contracts.service')
const profilesService = require('../services/profiles.service')

module.exports = (router) => {
  /**
   * @api {get} /jobs/unpaid Get unpaid jobs
   * @apiName GetUnpaidJobs
   * @apiGroup Jobs
   *
   * @apiSuccess {Object[]} jobs Array of jobs.
   */
  router.get('/jobs/unpaid', getProfile, async (req, res) => {
    const userContracts = await contractsService.findActiveContractsByClientId(req.profile.id)
    if (!userContracts.length) {
      return res.json([])
    }

    const jobs = await jobsService.findJobsByContractIds(userContracts.map(contract => contract.id))
    res.json(jobs)
  })

  /**
   * @api {post} /jobs/:job_id/pay Pay for job
   * @apiName PayForJob
   * @apiGroup Jobs
   *
   * @apiParam {Number} job_id Job id
   *
   * @apiSuccess {Object} Updated job.
   */
  router.post('/jobs/:job_id/pay', getProfile, async (req, res) => {
    if (req.profile.type !== 'client') {
      return res.status(403).json({
        error: 'Only clients can pay for jobs.',
      })
    }

    const job = await jobsService.getJobById(req.params.job_id)
    if (!job) return res.status(404).json({ error: 'Job not found' })
    if (job.paid) return res.status(400).json({ error: 'Job already paid' })

    const contract = await contractsService.findContractById(job.ContractId)
    if (!contract) return res.status(404).json({ error: 'Contract not found' })

    if (contract.ClientId !== req.profile.id) {
      return res.status(403).json({ error: 'You are not authorized to pay for this job.' })
    }

    const contractor = await profilesService.getContractorById(contract.ContractorId)
    if (!contractor) return res.status(404).json({ error: 'Contractor not found' })

    if (req.profile.balance < job.amount) {
      return res.status(403).json({ error: 'You do not have enough funds to pay for this job.' })
    }

    const updatedJob = await jobsService.payJob(req.profile, contractor, job)

    res.json(updatedJob)
  })
}
