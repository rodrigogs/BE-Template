const { getProfile } = require('../middleware/getProfile')
const balancesService = require('../services/balances.service')
const contractsService = require('../services/contracts.service')
const profilesService = require('../services/profiles.service')
const jobsService = require('../services/jobs.service')

module.exports = (router) => {
  /**
   * @api {post} /balances/deposit/:userId Deposit funds
   * @apiName DepositFunds
   * @apiGroup Balances
   *
   * @apiParam {Number} ammount Amount to deposit
   *
   * @apiSuccess {String} message Deposit successful.
   */
  router.post('/balances/deposit/:userId', getProfile, async (req, res) => {
    if (req.profile.type !== 'client') return res.status(403).json({ error: 'Only clients can deposit funds.' })

    let ammount = req.body.ammount
    if (isNaN(ammount) || ammount <= 0) return res.status(400).json({ error: 'Invalid ammount.' })
    ammount = Number(ammount)

    const client = await profilesService.getClientById(req.params.userId)
    if (!client) return res.status(404).json({ error: 'Client not found' })

    const userContracts = await contractsService.findActiveContractsByClientId(req.params.userId)
    const userJobs = await jobsService.findJobsByContractIds(userContracts.map(contract => contract.id))
    if (!userJobs.length) return res.status(400).json({ error: 'You have no unpaid jobs.' })

    const totalUnpaidJobsPrice = userJobs.reduce((acc, job) => acc + job.price, 0)

    if (!balancesService.canTransfer(ammount, totalUnpaidJobsPrice)) {
      return res.status(400).json({ error: 'You can only deposit 25% of your unpaid jobs.' })
    }

    if (req.profile.balance < ammount) {
      return res.status(400).json({ error: 'You do not have enough funds to deposit this ammount.' })
    }

    await balancesService.transferFunds(req.profile, client, ammount)

    res.json({ message: 'Deposit successful.' })
  })
}
