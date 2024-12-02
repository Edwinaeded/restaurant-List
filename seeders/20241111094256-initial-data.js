'use strict'
const bcrypt = require('bcryptjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let transaction

    try {
      let trancsation = await queryInterface.sequelize.transaction()

      const hashPsw = await bcrypt.hash('12345678', 10)
      await queryInterface.bulkInsert('Users', [
        {
          id: 1,
          email: 'user1@example.com',
          password: hashPsw
        },
        {
          id: 2,
          email: 'user2@example.com',
          password: hashPsw
        }
      ], { transaction })

      const initialData = require('./../public/jsons/restaurant.json').results
      await queryInterface.bulkInsert('restaurants',
        initialData, { transaction })

      await queryInterface.bulkUpdate(
        'restaurants',
        { userId: 1 },
        { id: {[Sequelize.Op.in]: [1, 2, 3]}},
        { transaction }
      )

      await queryInterface.bulkUpdate(
        'restaurants',
        { userId: 2 },
        { id: {[Sequelize.Op.in]: [4, 5, 6]}},
        { transaction }
      )
    } catch (error) {
      if (transaction) await transaction.rollback()
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null)
  }
};
    
