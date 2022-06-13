const dateFns = require('date-fns')
const { Op } = require('sequelize')
const { Contract, Job, Profile, sequelize } = require('../model')

const dateFormat = 'yyyy-MM-dd'

module.exports = {

  /**
   * @param {String} dateString
   * @returns {Date}
   */
  parseDate (dateString) {
    return dateFns.parse(dateString, dateFormat, new Date())
  },

  /**
   * Validates whether startDate is before endDate
   *
   * @param {String} startDate
   * @param {String} endDate
   * @returns {Boolean}
   */
  validateDateRange (startDate, endDate) {
    return dateFns.isBefore(startDate, endDate)
  },

  /**
   * Finds the best profession in the given date range
   *
   * @param {String} startDate
   * @param {String} endDate
   * @returns {Promise<String>} bestProfession
   */
  async findBestProfession (startDate, endDate) {
    const [bestResult] = await Contract.findAll({
      attributes: [
        [sequelize.fn('sum', sequelize.col('Jobs.price')), 'total'],
        [sequelize.col('Client.profession'), 'profession'],
      ],
      include: [
        {
          model: Profile,
          as: 'Client',
          required: true,
          attributes: [],
        },
        {
          model: Job,
          required: true,
          attributes: [],
          where: {
            paymentDate: {
              [Op.between]: [startDate, endDate],
            },
          },
        },
      ],
      group: [sequelize.col('profession')],
      order: [sequelize.literal('total DESC')],
      limit: 1,
      subQuery: false,
    })

    return bestResult
  },

  /**
   * Finds the best clients in the given date range
   *
   * @param {String} startDate
   * @param {String} endDate
   * @param {Number} [limit=2]
   * @returns {Promise<Object>} bestClients
   * @returns {Number} bestClients.id
   * @returns {String} bestClients.fullName
   * @returns {Number} bestClients.paid
   */
  async findBestClients (startDate, endDate, limit = 2) {
    const bestClients = await Contract.findAll({
      attributes: [
        [sequelize.col('Client.id'), 'id'],
        [sequelize.literal('Client.firstName || \' \' || Client.lastName'), 'fullName'],
        [sequelize.fn('sum', sequelize.col('Jobs.price')), 'paid'],
      ],
      include: [
        {
          model: Profile,
          as: 'Client',
          required: true,
          attributes: [],
        },
        {
          model: Job,
          required: true,
          attributes: [],
          where: {
            paymentDate: {
              [Op.between]: [startDate, endDate],
            },
          },
        },
      ],
      group: [sequelize.col('clientId')],
      order: [sequelize.literal('paid DESC')],
      limit,
      subQuery: false,
    })

    return bestClients
  },

}
