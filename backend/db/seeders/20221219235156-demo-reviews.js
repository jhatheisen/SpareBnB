'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   options.tableName = 'Reviews'
   await queryInterface.bulkInsert(options, [
    {
      userId: 1,
      spotId: 1,
      review: 'Pretty Nice',
      stars: 5,
    },
    {
      userId: 2,
      spotId: 1,
      review: 'Pretty bad',
      stars: 0,
    },
   ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  options.tableName = 'Reviews';
  const Op = Sequelize.Op;
  return queryInterface.bulkDelete(options, {
    spotId: { [Op.in]: [1]}
  })
  }
};
