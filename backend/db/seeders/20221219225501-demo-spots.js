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
   options.tableName = 'Spots'
   await queryInterface.bulkInsert(options, [
    {
      ownerId: 4,
      address: "123 Disney Lane",
      city: "San Francisco",
      state: "testStateUSA",
      country: "United States of America",
      lat: 37.7645358,
      lng: -122.4730327,
      name: "App Academy",
      description: "Place where web developers are created",
      price: 123,
      previewImage: "https://plus.unsplash.com/premium_photo-1670963964797-942df1804579?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8aG91c2V8ZW58MHx8MHx8&auto=format&fit=crop&w=400&q=60"
    },
    {
      ownerId: 2,
      address: "12 Disey Lne",
      city: "San Franco",
      state: "testStateUSA",
      country: "United America",
      lat: 3.7645358,
      lng: -12.4730327,
      name: "App emy",
      description: "Place where webs are created",
      price: 13,
      previewImage: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aG91c2V8ZW58MHx8MHx8&auto=format&fit=crop&w=400&q=60"
    },
    {
      ownerId: 1,
      address: "test",
      city: "test",
      state: "test",
      country: "test",
      lat: 100.21,
      lng: -100.21,
      name: "test",
      description: "Lorem ipsum dolor sit amet, nonummy ligula volutpat hac integer nonummy. Suspendisse ultricies, congue etiam tellus, erat libero, nulla eleifend, mauris pellentesque. Suspendisse integer praesent vel, integer gravida mauris, fringilla vehicula lacinia non",
      price: 123,
      previewImage: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8aG91c2V8ZW58MHx8MHx8&auto=format&fit=crop&w=400&q=60"
    },
    {
      ownerId: 1,
      address: "test",
      city: "test",
      state: "test",
      country: "test",
      lat: 100.21,
      lng: -100.21,
      name: "test",
      description: "test",
      price: 123,
      previewImage: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8aG91c2V8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"
    },
    {
      ownerId: 1,
      address: "test",
      city: "test",
      state: "test",
      country: "test",
      lat: 100.21,
      lng: -100.21,
      name: "test",
      description: "test",
      price: 123,
      previewImage: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8aG91c2V8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"
    },
    {
      ownerId: 1,
      address: "test",
      city: "test",
      state: "test",
      country: "test",
      lat: 100.21,
      lng: -100.21,
      name: "test",
      description: "test",
      price: 123,
      previewImage: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGhvdXNlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
    },
    {
      ownerId: 1,
      address: "test",
      city: "test",
      state: "test",
      country: "test",
      lat: 100.21,
      lng: -100.21,
      name: "test",
      description: "test",
      price: 123,
      previewImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8aG91c2V8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"
    },
    {
      ownerId: 1,
      address: "test",
      city: "test",
      state: "test",
      country: "test",
      lat: 100.21,
      lng: -100.21,
      name: "test",
      description: "test",
      price: 123,
      previewImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fGhvdXNlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
    },
    {
      ownerId: 1,
      address: "test",
      city: "test",
      state: "test",
      country: "test",
      lat: 100.21,
      lng: -100.21,
      name: "test",
      description: "test",
      price: 123,
      previewImage: "https://images.unsplash.com/photo-1576941089067-2de3c901e126?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fGhvdXNlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
    },
    {
      ownerId: 1,
      address: "test",
      city: "test",
      state: "test",
      country: "test",
      lat: 100.21,
      lng: -100.21,
      name: "test",
      description: "test",
      price: 123,
      previewImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fGhvdXNlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
    },
    {
      ownerId: 1,
      address: "test",
      city: "test",
      state: "test",
      country: "test",
      lat: 100.21,
      lng: -100.21,
      name: "test",
      description: "test",
      price: 123,
      previewImage: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fGhvdXNlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
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
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      state: { [Op.in]: ['testStateUSA'] }
    }, {});
  }
};
