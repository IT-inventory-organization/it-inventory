'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class Role extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   };
//   Role.init({
//     name: DataTypes.STRING
//   }, {
//     sequelize,
//     modelName: 'Role',
//   });
//   return Role;
// };
const Sequelize = require('sequelize');
const db = require('../../configs/database');

const User = db.define('Roles', {
  name: {
    type: Sequelize.STRING
  }
}, {
  tableName: 'Roles',
});

module.exports = User;