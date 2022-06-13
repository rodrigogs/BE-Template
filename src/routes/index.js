const express = require('express')
const contractsController = require('./contracts.controller')
const jobsController = require('./jobs.controller')
const balancesController = require('./balances.controller')
const adminController = require('./admin.controller')
const errorHandler = require('../middleware/errorHandler')

const router = express.Router()

router.get('/', (req, res) => {
  res.json({ message: 'It works!' })
})

contractsController(router)
jobsController(router)
balancesController(router)
adminController(router)

router.use(errorHandler)

module.exports = router
