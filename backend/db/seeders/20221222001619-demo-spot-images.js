'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    options.tableName = 'SpotImages'
    await queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: 'https://plus.unsplash.com/premium_photo-1670963964797-942df1804579?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8aG91c2V8ZW58MHx8MHx8&auto=format&fit=crop&w=400&q=60',
        preview: true,
      },
      {
        spotId: 1,
        url: 'https://images.pexels.com/photos/775219/pexels-photo-775219.jpeg?auto=compress&cs=tinysrgb&w=400',
        preview: true,
      },
      {
        spotId: 1,
        url: 'https://images.pexels.com/photos/6276142/pexels-photo-6276142.jpeg?auto=compress&cs=tinysrgb&w=400',
        preview: true,
      },
      {
        spotId: 1,
        url: 'https://images.pexels.com/photos/289560/pexels-photo-289560.jpeg?auto=compress&cs=tinysrgb&w=400',
        preview: true,
      },
      {
        spotId: 2,
        url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aG91c2V8ZW58MHx8MHx8&auto=format&fit=crop&w=400&q=6',
        preview: true,
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1,2,3,4,5] }
    }, {});
  }
};
