const { Job, sequelize } = require('../model')

module.exports = {

  /**
   * @param {Number[]} contracIds
   * @returns {Promise<Object[]>}
   */
  findJobsByContractIds (contractIds) {
    return Job.findAll({
      where: {
        ContractId: contractIds,
        paid: null,
      },
    })
  },

  /**
   * @param {Number} jobId
   * @returns {Promise<Object>}
   */
  getJobById (jobId) {
    return Job.findOne({ where: { id: jobId } })
  },

  /**
   * @param {Object} client
   * @param {Object} contractor
   * @param {Object} job
   * @returns {Promise<Object>} job
   */
  async payJob (client, contractor, job) {
    client.balance -= job.price
    contractor.balance += job.price
    job.paid = true
    job.paymentDate = new Date()

    await sequelize.transaction(async (transaction) => {
      await Promise.all([
        client.save({ transaction }),
        contractor.save({ transaction }),
        job.save({ transaction }),
      ])
    })

    return job
  },

}
