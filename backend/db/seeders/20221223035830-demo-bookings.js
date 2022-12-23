'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    options.tableName = 'Bookings';
    await queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 1,
        startDate: new Date("2024-12-24"),
        endDate: new Date("2024-12-25"),
      },
      {
        spotId: 2,
        userId: 4,
        startDate: new Date("2020-12-15"),
        endDate: new Date("2020-12-20"),
      },
      {
        spotId: 2,
        userId: 3,
        startDate: new Date("2024-12-30"),
        endDate: new Date("2024-12-31"),
      }
    ]);

  },

  async down (queryInterface, Sequelize) {

    options.tableName = 'Bookings';
    const Op = sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 4, 3]}
    }, {});

  }
};
