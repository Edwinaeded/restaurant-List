'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('restaurants', 'userId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'ID'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('restaurants', 'userId')
  }
};
