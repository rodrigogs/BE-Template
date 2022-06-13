const { Contract } = require('../model')

module.exports = {

  /**
   * @param {Number} id
   * @param {String} type
   * @returns {Promise<Object>}
   */
  getUserContracts (id, type) {
    return Contract.findAll({ where: { [type]: id } })
  },

  /**
   * @param {Number} contractId
   * @returns {Promise<Object>}
   */
  findContractById (contractId) {
    return Contract.findOne({ where: { id: contractId } })
  },

  /**
   * @param {Number} clientId
   * @returns {Promise<Object[]>}
   */
  findActiveContractsByClientId (clientId) {
    return Contract.findAll({
      where: {
        ClientId: clientId,
        status: 'in_progress',
      },
    })
  },

}
