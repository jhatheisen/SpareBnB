'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    options.tableName = 'ReviewImages'
    await queryInterface.bulkInsert(options, [
      {
        reviewId: 1,
        url: 'image url',
        previewImage: true,
      },
      {
        reviewId: 2,
        url: 'image url',
        previewImage: true,
      },
      {
        reviewId: 3,
        url: 'image url',
        previewImage: true,
      },
      {
        reviewId: 4,
        url: 'image url',
        previewImage: true,
      },
      {
        reviewId: 5,
        url: 'image url',
        previewImage: true,
      },
      {
        reviewId: 5,
        url: 'image url',
        previewImage: false,
      },
      {
        reviewId: 6,
        url: 'image url',
        previewImage: true,
      },
      {
        reviewId: 6,
        url: 'image url',
        previewImage: false,
      },
    ]);
  },

  async down (queryInterface, Sequelize) {

    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1,2,3,4,5,6,7,8] }
    }, {});
  }
};
