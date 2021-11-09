'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class dokumen_tambahan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  dokumen_tambahan.init({
    nomorBC10: DataTypes.STRING,
    nomorBC11: DataTypes.STRING,
    nomorBL: DataTypes.STRING,
    tanggalBC10: DataTypes.STRING,
    tanggalBC11: DataTypes.STRING,
    tanggalBL: DataTypes.STRING,
    reportId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'dokumen_tambahan',
  });
  return dokumen_tambahan;
};