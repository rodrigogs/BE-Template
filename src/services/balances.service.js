const { sequelize } = require('../model')

module.exports = {

  /**
   * @param {Number} ammountToTransfer
   * @param {Number} totalUnpaidJobsPrice
   * @returns {Boolean}
   */
  canTransfer (ammountToTransfer, totalUnpaidJobsPrice) {
    return ammountToTransfer < (totalUnpaidJobsPrice * 0.25)
  },

  /**
   * @param {Object} fromClient
   * @param {Object} toClient
   * @param {Number} amount
   * @returns {Promise<void>}
   */
  async transferFunds (fromClient, toClient, amount) {
    fromClient.balance -= amount
    toClient.balance += amount

    await sequelize.transaction(async (transaction) => {
      await Promise.all([
        fromClient.save({ transaction }),
        toClient.save({ transaction }),
      ])
    })
  },

}
