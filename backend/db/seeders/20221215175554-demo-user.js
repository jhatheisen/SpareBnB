'use strict';
const bcrypt = require('bcryptjs');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
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
   options.tableName = 'Users';
   return queryInterface.bulkInsert(options, [
    {
      email: 'user1@user.io',
      username: 'userwon',
      hashedPassword: bcrypt.hashSync('password1'),
    },
    {
      email: 'user2@user.io',
      username: 'usertoo',
      hashedPassword: bcrypt.hashSync('password2'),
    },
    {
      email: 'user3@user.io',
      username: 'usertree',
      hashedPassword: bcrypt.hashSync('password3'),
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
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['userwon', 'usertoo', 'usertree'] }
    }, {})
  }
};
