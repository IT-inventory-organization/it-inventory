'use strict';
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const User = db.define('Users', {
  owner_name: {
    type: Sequelize.STRING,
    // unique: true
  },
  email: {
    type: Sequelize.STRING
  },
  npwp: {
    type: Sequelize.STRING,
  },
  address_company: {
    type: Sequelize.STRING,
  },
  mobile_phone: {
    type: Sequelize.STRING,
  },
  username: {
    type: Sequelize.STRING,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
  },
  is_active: {
    type: Sequelize.BOOLEAN,
  },
  phone: {
    type: Sequelize.STRING,
  },
  address_owner: {
    allowNull: true,
    type: Sequelize.STRING,
  },
  company_name: {
    allowNull: true,
    type: Sequelize.STRING
  },
  business_field: {
    allowNull: true,
    type: Sequelize.STRING
  },
  role_id: {
    type: Sequelize.INTEGER,
    defaultValue: 3,
    references: {
      model: 'Roles',
      key: 'id'
    },
    onUpdate: 'cascade',
    onDelete: 'cascade'
  }
}, {
  tableName: 'Users',
});

module.exports = User;