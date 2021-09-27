'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
const Sequelize = require('sequelize');
// const sequelize = require('../../configs/database');


module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    name: DataTypes.STRING,
    npwp: DataTypes.STRING,
    address: DataTypes.STRING,
    email: DataTypes.STRING,
    mobile_phone: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN,
    phone: DataTypes.STRING,
    role_id: {
      type: DataTypes.STRING,
      defaultValue: 2
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};