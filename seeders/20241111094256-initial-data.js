'use strict'
const bcrypt = require('bcryptjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let transaction

    try {
      transaction = await queryInterface.sequelize.transaction()

      const hashPsw = await bcrypt.hash('12345678', 10)
      await queryInterface.bulkInsert('Users', [
        {
          id: 1,
          email: 'user1@example.com',
          password: hashPsw,
          name: 'user1',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          email: 'user2@example.com',
          password: hashPsw,
          name: 'user2',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction })

      const initialData = require('./../public/jsons/restaurant.json').results.map(item => ({
        ...item,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
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
        { id: {[Sequelize.Op.in]: [4, 5, 6, 7, 8]}},
        { transaction }
      )

      await transaction.commit()
    } catch (error) {
      if (transaction) await transaction.rollback()
        throw error
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null)
  }
};
    
