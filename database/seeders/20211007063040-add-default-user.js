'use strict';
const { createHashText } = require('../../helper/bcrypt')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
     await queryInterface.bulkInsert('Users', [{
        name: 'Owner',
        address: '',
        npwp: '',
        email: 'Owner-BeaCukai@gmail.com',
        mobile_phone: '',
        username: 'Owner',
        password: createHashText('Owner@-123'),
        is_active: true,
        phone: '',
        role_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },{
        name: 'Bea Cukai',
        address: '',
        npwp: '',
        email: 'Admin-BeaCukai@gmail.com',
        mobile_phone: '',
        username: 'BeaCukai',
        password: createHashText('BeaCukai@-123'),
        is_active: true,
        phone: '',
        role_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.bulkDelete('Users', null);
  }
};
