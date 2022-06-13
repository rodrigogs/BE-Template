const { getProfile } = require('../middleware/getProfile')
const adminService = require('../services/admin.service')

module.exports = (router) => {
  /**
   * @api {get} /admin/best-profession Returns the profession that earned the most money (sum of jobs paid) for any contactor that worked in the query time range.
   * @apiName GetBestProfession
   * @apiGroup Admin
   *
   * @apiParam {String} startDate The start date of the query time range.
   * @apiParam {String} endDate The end date of the query time range.
   *
   * @apiSuccess {String} bestProfession The profession that earned the most money.
   * @apiSuccessExample {json} Success-Response:
   *    HTTP/1.1 200 OK
   *   {
   *     "bestProfession": "Web Developer"
   *   }
   */
  router.get('/admin/best-profession', getProfile, async (req, res) => {
    const { start, end } = req.query

    if (!start || !end) {
      return res.status(400).json({ error: 'Missing start or end date' })
    }

    const startDate = adminService.parseDate(start)
    const endDate = adminService.parseDate(end)

    if (!adminService.validateDateRange(startDate, endDate)) {
      return res.status(400).json({ error: 'Start date must be before end date' })
    }

    const bestResult = await adminService.findBestProfession(startDate, endDate)

    if (!bestResult) {
      return res.status(404).json({ error: 'No results found' })
    }

    res.json({ bestProfession: bestResult.get('profession') })
  })

  /**
   * @api {get} /admin/best-clients Returns the clients the paid the most for jobs in the query time period. limit query parameter should be applied, default limit is 2.
   * @apiName GetBestClients
   * @apiGroup Admin
   *
   * @apiParam {String} startDate The start date of the query time range.
   * @apiParam {String} endDate The end date of the query time range.
   * @apiParam {Number} [limit] The number of clients to return.
   *
   * @apiSuccess {Object[]} bestClients An array of clients with their total paid.
   * @apiSuccess {Number} bestClients.id The id of the client.
   * @apiSuccess {String} bestClients.fullName The full name of the client.
   * @apiSuccess {Number} bestClients.paid The total paid by the client.
   * @apiSuccessExample {json} Success-Response:
   *   HTTP/1.1 200 OK
   *  [
   *   {
   *     "id": 1,
   *     "fullName": "John Doe",
   *     "paid": 100
   *   },
   *  ]
   */
  router.get('/admin/best-clients', getProfile, async (req, res) => {
    const { start, end, limit } = req.query

    if (!start || !end) {
      return res.status(400).json({ error: 'Missing start or end date' })
    }

    const startDate = adminService.parseDate(start)
    const endDate = adminService.parseDate(end)

    if (!adminService.validateDateRange(startDate, endDate)) {
      return res.status(400).json({ error: 'Start date must be before end date' })
    }

    const bestClients = await adminService.findBestClients(startDate, endDate, limit)

    res.json(bestClients)
  })
}
