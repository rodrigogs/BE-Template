const { getProfile } = require('../middleware/getProfile')
const contractsService = require('../services/contracts.service')

module.exports = (router) => {
  /**
   * @api {get} /contracts Get all contracts for logged user
   * @apiName GetAllContracts
   * @apiGroup Contracts
   *
   * @apiSuccess {Object[]} contracts Array of contracts.
   */
  router.get('/contracts', getProfile, async (req, res) => {
    const profileType = req.profile.type === 'client' ? 'ClientId' : 'ContractorId'
    const userContracts = await contractsService.getUserContracts(req.profile.id, profileType)

    res.json(userContracts)
  })

  /**
   * @api {get} /contracts/:id Get contract by id
   * @apiName GetContractById
   * @apiGroup Contracts
   *
   * @apiParam {Number} id Contract id
   *
   * @apiSuccess {Object} contract Contract.
   */
  router.get('/contracts/:id', getProfile, async (req, res) => {
    const { id } = req.params

    const contract = await contractsService.findContractById(id)
    if (!contract) return res.status(404).json({ error: 'Contract not found' })

    const profileId = req.profile.type === 'client' ? contract.ClientId : contract.ContractorId
    if (profileId !== req.profile.id) {
      return res.status(403).json({ error: 'You are not authorized to view this contract.' })
    }

    if (!contract) return res.status(404).end()

    res.json(contract)
  })
}
