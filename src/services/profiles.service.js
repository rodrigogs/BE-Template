const { Profile } = require('../model')

module.exports = {

  /**
   * @param {Number} clientId
   * @returns {Promise<Object>}
   */
  getClientById (clientId) {
    return Profile.findOne({ where: { id: clientId, type: 'client' } })
  },

  /**
   * @param {Number} contractorId
   * @returns {Promise<Object>}
   */
  getContractorById (contractorId) {
    return Profile.findOne({ where: { id: contractorId, type: 'contractor' } })
  },

}
