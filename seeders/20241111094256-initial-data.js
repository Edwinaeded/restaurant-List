'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const initialData = require("./../public/jsons/restaurant.json").results
    await queryInterface.bulkInsert("restaurants",
      initialData
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("restaurants",null)
  }
};
